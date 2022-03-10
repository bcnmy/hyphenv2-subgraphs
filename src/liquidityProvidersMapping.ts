import { Address, BigDecimal, BigInt, log } from "@graphprotocol/graph-ts"
import { LiquidityPool } from "../generated/LiquidityPool/LiquidityPool";
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
  RollingAvailableLiquidityForLast24Hour
} from "../generated/schema"

// import { updateAvailableLiquidity } from "./liquidity";

export function updateAvailableLiquidity(txId: string, tokenAddress: Address, timestamp: BigInt, eventAddress: Address): void {
  const liquidityPoolContract = LiquidityPool.bind(eventAddress);
  const currentAvailableLiquiliquidity = liquidityPoolContract.getCurrentLiquidity(tokenAddress);

  const logKey = `${txId}-${tokenAddress.toHex()}`;
  let availableLiquidityLogEntry = AvailableLiquidityLogEntry.load(logKey);
  if (!availableLiquidityLogEntry) {
      availableLiquidityLogEntry = new AvailableLiquidityLogEntry(logKey);
      availableLiquidityLogEntry.tokenAddress = tokenAddress;
      availableLiquidityLogEntry.timestamp = timestamp;
  } else {
      availableLiquidityLogEntry.save();
      return;
  }

  const epochModSecondsInAHour = timestamp.mod(BigInt.fromI32(3600));
  const hourEpoch = timestamp.minus(epochModSecondsInAHour);

  let hourlyAvailableLiquidity = HourlyAvailableLiquidity.load(`${tokenAddress.toHex()}-${hourEpoch.toString()}`);
  if (!hourlyAvailableLiquidity) {
      hourlyAvailableLiquidity = new HourlyAvailableLiquidity(tokenAddress.toHex());
      hourlyAvailableLiquidity.availableLiquidity = BigInt.fromI32(0);
      hourlyAvailableLiquidity.tokenAddress = tokenAddress;
      hourlyAvailableLiquidity.timestamp = hourEpoch;
      hourlyAvailableLiquidity.count = BigInt.fromI32(0);
  }

  hourlyAvailableLiquidity.count = hourlyAvailableLiquidity.count.plus(BigInt.fromI32(1));
  hourlyAvailableLiquidity.availableLiquidity = (hourlyAvailableLiquidity.availableLiquidity.times(hourlyAvailableLiquidity.count)).plus(currentAvailableLiquiliquidity).div(hourlyAvailableLiquidity.count);
  hourlyAvailableLiquidity.save();


  let availableLiquidityRollingWindow = RollingAvailableLiquidityForLast24Hour.load(tokenAddress.toHex());
  if (!availableLiquidityRollingWindow) {
      availableLiquidityRollingWindow = new RollingAvailableLiquidityForLast24Hour(tokenAddress.toHex());
      availableLiquidityRollingWindow.tokenAddress = tokenAddress;
      availableLiquidityRollingWindow.availableLiquidity = BigInt.fromI32(0);
      availableLiquidityRollingWindow.count = BigInt.fromI32(0);
  }

  availableLiquidityRollingWindow.count = availableLiquidityRollingWindow.count.plus(BigInt.fromI32(1));
  availableLiquidityRollingWindow.availableLiquidity = (availableLiquidityRollingWindow.availableLiquidity.times(availableLiquidityRollingWindow.count)).plus(currentAvailableLiquiliquidity).div(availableLiquidityRollingWindow.count);

  let oldAvailableLiquidityLogs = availableLiquidityRollingWindow.logs;
  if (oldAvailableLiquidityLogs !== null) {
      // sliding window calculation
      for (let i = 0; i < oldAvailableLiquidityLogs.length; i++) {
          // for every feeDetailLogEntry in the rolling window, check if they are old enough to remove
          // if so, then remove and also decrease their values from cumulative rolling window values
          let oldAvailableLiquidityLog = AvailableLiquidityLogEntry.load(oldAvailableLiquidityLogs[i]);
          if (!oldAvailableLiquidityLog) continue;
          if (timestamp.minus(oldAvailableLiquidityLog.timestamp) > BigInt.fromI32(3600)) {
              oldAvailableLiquidityLog.availableLiquidityRollingWindow = null;
              oldAvailableLiquidityLog.save();

              availableLiquidityRollingWindow.count = availableLiquidityRollingWindow.count.minus(BigInt.fromI32(1));
              availableLiquidityRollingWindow.availableLiquidity = (availableLiquidityRollingWindow.availableLiquidity.times(availableLiquidityRollingWindow.count)).minus(oldAvailableLiquidityLog.availableLiquidity).div(availableLiquidityRollingWindow.count);
          }
      }
  }

  availableLiquidityRollingWindow.save();
  availableLiquidityLogEntry.availableLiquidityRollingWindow = availableLiquidityRollingWindow.id;
  availableLiquidityLogEntry.save();
}

export function handleCurrentLiquidityChanged(event: CurrentLiquidityChanged): void {
  updateAvailableLiquidity(event.transaction.hash.toHex(), event.params.token, event.block.timestamp, event.address);
}

export function handleLiquidityAdded(event: LiquidityAdded): void {
  // When liquidity is added, the supplied liquidity increases, along with available liquidity
  updateAvailableLiquidity(event.transaction.hash.toHex(), event.params.tokenAddress, event.block.timestamp, event.address);
}

export function handleLiquidityRemoved(event: LiquidityRemoved): void {
  // When liquidity is removed, the supplied liquidity decreases, along with available liquidity
  updateAvailableLiquidity(event.transaction.hash.toHex(), event.params.tokenAddress, event.block.timestamp, event.address);
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
    rollingApyFor24Hour.firstTokenPriceInLPShares = currentTokenPriceInLPShares;
    rollingApyFor24Hour.tokenAddress = tokenPriceInLPSharesLog.tokenAddress;
  }

  let oldLpLogs = rollingApyFor24Hour.lpLogs;
  // window sliding logic
  if (oldLpLogs !== null) {
    // log.info("Enterred loop, array length {}", [oldLpLogs.length.toString()]);
    for (let i = 0, windowSearchComplete = false; i < oldLpLogs.length && !windowSearchComplete; i++) {
      let oldLpLog = TokenPriceInLPSharesLog.load(oldLpLogs[i]);
      if (!oldLpLog) continue;
      if (oldLpLog.timestamp.minus(tokenPriceInLPSharesLog.timestamp) > BigInt.fromI32(86400)) {
        // log.info("Found old log, removing", []);
        oldLpLog.rollingApyWindow = null;
        oldLpLog.save();
      } else {
        // log.info("Found first okay log, keeping firstTokenPriceInLPShares:", [oldLpLog.tokenPriceInLPShares.toString()]);
        rollingApyFor24Hour.lastTokenPriceInLPShares = oldLpLog.tokenPriceInLPShares;
        windowSearchComplete = true;
      }
    }
  } else {
    // log.info("Didnt enter loop because no array", []);
    rollingApyFor24Hour.lastTokenPriceInLPShares = currentTokenPriceInLPShares;
  }

  tokenPriceInLPSharesLog.rollingApyWindow = rollingApyFor24Hour.id;
  rollingApyFor24Hour.apy = calculateApy(rollingApyFor24Hour.firstTokenPriceInLPShares, rollingApyFor24Hour.lastTokenPriceInLPShares);

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