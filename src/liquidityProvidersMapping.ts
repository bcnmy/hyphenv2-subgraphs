import { Address, BigDecimal, BigInt, log } from "@graphprotocol/graph-ts"
// import { LiquidityPool } from "../generated/LiquidityPool/LiquidityPool";
import {
  LiquidityAdded,
  LiquidityRemoved,
  FeeAdded,
  LiquidityProviders,
  CurrentLiquidityChanged
} from "../generated/LiquidityProviders/LiquidityProviders"

import {
  TokenPriceInLPSharesLog,
  RollingApyFor24Hour,
  DailyApy,
  AvailableLiquidityLogEntry,
  HourlyAvailableLiquidity,
  RollingAvailableLiquidityForLast24Hour,
  SuppliedLiquidityLogEntry,
  HourlySuppliedLiquidity,
  RollingSuppliedLiquidityForLast24Hour
} from "../generated/schema"

import { updateAvailableLiquidity } from "./mapping";

export function updateSuppliedLiquidity(txId: string, tokenAddress: Address, timestamp: BigInt, eventAddress: Address): void {
  const LiquidityProviderContract = LiquidityProviders.bind(eventAddress);
  const currentSuppliedLiquidity = LiquidityProviderContract.getSuppliedLiquidityByToken(tokenAddress);

  const logKey = `${txId}-${tokenAddress.toHex()}`;

  let suppliedLiquidityLogEntry = SuppliedLiquidityLogEntry.load(logKey);
  if (!suppliedLiquidityLogEntry) {
    suppliedLiquidityLogEntry = new SuppliedLiquidityLogEntry(logKey);
    suppliedLiquidityLogEntry.tokenAddress = tokenAddress;
    suppliedLiquidityLogEntry.timestamp = timestamp;
    suppliedLiquidityLogEntry.suppliedLiquidity = currentSuppliedLiquidity;
  } else {
    suppliedLiquidityLogEntry.save();
    return;
  }

  const epochModSecondsInAHour = timestamp.mod(BigInt.fromI32(3600));
  const hourEpoch = timestamp.minus(epochModSecondsInAHour);

  let hourlySuppliedLiquidity = HourlySuppliedLiquidity.load(`${tokenAddress.toHex()}-${hourEpoch.toString()}`);
  if (!hourlySuppliedLiquidity) {
    hourlySuppliedLiquidity = new HourlySuppliedLiquidity(tokenAddress.toHex());
    hourlySuppliedLiquidity.suppliedLiquidity = BigInt.fromI32(0);
    hourlySuppliedLiquidity.tokenAddress = tokenAddress;
    hourlySuppliedLiquidity.timestamp = hourEpoch;
    hourlySuppliedLiquidity.count = BigInt.fromI32(0);
  }

  hourlySuppliedLiquidity.count = hourlySuppliedLiquidity.count.plus(BigInt.fromI32(1));
  hourlySuppliedLiquidity.suppliedLiquidity = (hourlySuppliedLiquidity.suppliedLiquidity.times(hourlySuppliedLiquidity.count)).plus(currentSuppliedLiquidity).div(hourlySuppliedLiquidity.count);
  hourlySuppliedLiquidity.save();

  let suppliedLiquidityRollingWindow = RollingSuppliedLiquidityForLast24Hour.load(tokenAddress.toHex());
  if (!suppliedLiquidityRollingWindow) {
    suppliedLiquidityRollingWindow = new RollingSuppliedLiquidityForLast24Hour(tokenAddress.toHex());
    suppliedLiquidityRollingWindow.tokenAddress = tokenAddress;
    suppliedLiquidityRollingWindow.suppliedLiquidity = BigInt.fromI32(0);
    suppliedLiquidityRollingWindow.count = BigInt.fromI32(0);
    suppliedLiquidityRollingWindow.logs = new Array<string>();
  }

  suppliedLiquidityRollingWindow.count = suppliedLiquidityRollingWindow.count.plus(BigInt.fromI32(1));
  suppliedLiquidityRollingWindow.suppliedLiquidity = (suppliedLiquidityRollingWindow.suppliedLiquidity.times(suppliedLiquidityRollingWindow.count)).plus(currentSuppliedLiquidity).div(suppliedLiquidityRollingWindow.count);

  let oldSuppliedLiquidityLogs = suppliedLiquidityRollingWindow.logs;
  let newSuppliedLiquidityLogs = new Array<string>();
  newSuppliedLiquidityLogs.push(suppliedLiquidityLogEntry.id);

  // sliding window calculation
  for (let i = 0; i < oldSuppliedLiquidityLogs.length; i++) {
    // for every feeDetailLogEntry in the rolling window, check if they are old enough to remove
    // if so, then remove and also decrease their values from cumulative rolling window values
    let oldSuppliedLiquidityLog = SuppliedLiquidityLogEntry.load(oldSuppliedLiquidityLogs[i]);
    if (!oldSuppliedLiquidityLog) continue;
    if (timestamp.minus(oldSuppliedLiquidityLog.timestamp) > BigInt.fromI32(3600)) {
      suppliedLiquidityRollingWindow.count = suppliedLiquidityRollingWindow.count.minus(BigInt.fromI32(1));
      suppliedLiquidityRollingWindow.suppliedLiquidity = (suppliedLiquidityRollingWindow.suppliedLiquidity.times(suppliedLiquidityRollingWindow.count)).minus(oldSuppliedLiquidityLog.suppliedLiquidity).div(suppliedLiquidityRollingWindow.count);
    } else {
      newSuppliedLiquidityLogs.push(oldSuppliedLiquidityLog.id);
    }
  }

  suppliedLiquidityRollingWindow.logs = newSuppliedLiquidityLogs;
  suppliedLiquidityRollingWindow.save();
  suppliedLiquidityLogEntry.save();
}

export function handleCurrentLiquidityChanged(event: CurrentLiquidityChanged): void {
  updateAvailableLiquidity(event.transaction.hash.toHex(), event.params.token, event.block.timestamp, event.address);
}

export function handleLiquidityAdded(event: LiquidityAdded): void {
  // When liquidity is added, the supplied liquidity increases, along with available liquidity
  updateAvailableLiquidity(event.transaction.hash.toHex(), event.params.tokenAddress, event.block.timestamp, event.address);
  updateSuppliedLiquidity(event.transaction.hash.toHex(), event.params.tokenAddress, event.block.timestamp, event.address);
}

export function handleLiquidityRemoved(event: LiquidityRemoved): void {
  // When liquidity is removed, the supplied liquidity decreases, along with available liquidity
  updateAvailableLiquidity(event.transaction.hash.toHex(), event.params.tokenAddress, event.block.timestamp, event.address);
  updateSuppliedLiquidity(event.transaction.hash.toHex(), event.params.tokenAddress, event.block.timestamp, event.address);
}

export function handleFeeAdded(event: FeeAdded): void {
  // When fee is added, the LP token price compared to base token price changes
  // We use this event to capture the difference, and calculate the APY
  const epochModSecondsInADay = event.block.timestamp.mod(BigInt.fromI32(86400));
  const todayEpoch = event.block.timestamp.minus(epochModSecondsInADay);

  const contract = LiquidityProviders.bind(event.address);
  const currentTokenPriceInLPShares = contract.getTokenPriceInLPShares(event.params.tokenAddress);

  let tokenPriceInLPSharesLog = new TokenPriceInLPSharesLog(`${event.transaction.hash.toHexString()}-${event.params.tokenAddress.toHexString()}`);
  tokenPriceInLPSharesLog.tokenAddress = event.params.tokenAddress;
  tokenPriceInLPSharesLog.tokenPriceInLPShares = currentTokenPriceInLPShares;
  tokenPriceInLPSharesLog.timestamp = event.block.timestamp;

  // 24 hour window calculation
  let rollingApyFor24Hour = RollingApyFor24Hour.load(tokenPriceInLPSharesLog.tokenAddress.toHexString());
  if (!rollingApyFor24Hour) {
    rollingApyFor24Hour = new RollingApyFor24Hour(tokenPriceInLPSharesLog.tokenAddress.toHexString());
    rollingApyFor24Hour.tokenAddress = tokenPriceInLPSharesLog.tokenAddress;
    rollingApyFor24Hour.lpLogs = new Array<string>();
    // log.info("Last LP Log: outside loop", [rollingApyFor24Hour.lastLog]);
  }
  rollingApyFor24Hour.lastTokenPriceInLPShares = currentTokenPriceInLPShares;
  rollingApyFor24Hour.lastLog = tokenPriceInLPSharesLog.id;
  log.info("First LP Log: {}", [rollingApyFor24Hour.firstLog]);


  let oldLpLogs = rollingApyFor24Hour.lpLogs;

  let firstTokenPriceInLPSharesFallback = BigInt.fromI32(0);
  let isFirstTokenPriceInLPSharesFallbackActive = false;
  while (true) {
    if (oldLpLogs.length > 0) {
      let oldLpLog = TokenPriceInLPSharesLog.load(oldLpLogs[0]);
      if (!oldLpLog) continue;
      if (tokenPriceInLPSharesLog.timestamp.minus(oldLpLog.timestamp).gt(BigInt.fromI32(86400))) {
        log.info("Found old log, removing", []);
        oldLpLogs.shift();
        //If this was the last remaining option for firstTokenPriceInLPShares, then activate the fallback
        if (oldLpLogs.length === 0) {
          firstTokenPriceInLPSharesFallback = oldLpLog.tokenPriceInLPShares;
          isFirstTokenPriceInLPSharesFallbackActive = true;
        }
      } else {
        log.info("Found first okay log, keeping firstTokenPriceInLPShares:", [oldLpLog.tokenPriceInLPShares.toString()]);
        rollingApyFor24Hour.firstTokenPriceInLPShares = oldLpLog.tokenPriceInLPShares;
        rollingApyFor24Hour.firstLog = oldLpLog.id;
        log.info("Last LP in loop Log: {} Timestamp: {}", [oldLpLog.id, oldLpLog.timestamp.toString()]);
        break;
      }
    } else {
      if (isFirstTokenPriceInLPSharesFallbackActive) {
        rollingApyFor24Hour.firstTokenPriceInLPShares = firstTokenPriceInLPSharesFallback;
      } else {
        rollingApyFor24Hour.firstTokenPriceInLPShares = currentTokenPriceInLPShares;
      }
      log.info("LP LOG: First is equal to last {}", [rollingApyFor24Hour.firstLog]);
      break;
    }
  }
  log.info("Last LP Log: outside loop {}", [rollingApyFor24Hour.lastLog]);


  rollingApyFor24Hour.apy = calculateApy(rollingApyFor24Hour.firstTokenPriceInLPShares, rollingApyFor24Hour.lastTokenPriceInLPShares);

  oldLpLogs.push(tokenPriceInLPSharesLog.id);
  rollingApyFor24Hour.lpLogs = oldLpLogs;

  // daily calculation
  const todayApyId = `${todayEpoch}-${event.params.tokenAddress.toHexString()}`;
  let todayApy = DailyApy.load(todayApyId);

  if (!todayApy) {
    todayApy = new DailyApy(todayApyId);
    todayApy.firstTokenPriceInLPShares = currentTokenPriceInLPShares;
    todayApy.timestamp = todayEpoch;
    todayApy.tokenAddress = event.params.tokenAddress;
  }
  todayApy.lastTokenPriceInLPShares = currentTokenPriceInLPShares;
  todayApy.apy = calculateApy(todayApy.firstTokenPriceInLPShares, todayApy.lastTokenPriceInLPShares);

  tokenPriceInLPSharesLog.save();
  rollingApyFor24Hour.save();
  todayApy.save();
}

function calculateApy(firstTokenPriceInLPShares: BigInt, lastTokenPriceInLPShares: BigInt): BigDecimal {
  if (firstTokenPriceInLPShares === lastTokenPriceInLPShares) {
    return BigInt.fromI32(0).toBigDecimal();
  }

  const apyStepOne = firstTokenPriceInLPShares.toBigDecimal().div(
    lastTokenPriceInLPShares.toBigDecimal()
  );

  let apyStepTwo = apyStepOne;

  for (let i = 1; i < 365; i++) {
    apyStepTwo = apyStepTwo.times(apyStepOne);
  }

  return apyStepTwo.minus(BigInt.fromI32(1).toBigDecimal()).times(BigInt.fromI32(100).toBigDecimal());
}