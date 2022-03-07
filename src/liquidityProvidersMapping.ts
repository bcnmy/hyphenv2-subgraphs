import { BigDecimal, BigInt, log } from "@graphprotocol/graph-ts"
import {
  LiquidityAdded,
  LiquidityRemoved,
  FeeAdded,
  LiquidityProviders
} from "../generated/LiquidityProviders/LiquidityProviders"

import {
  TokenPriceInLPSharesLog,
  RollingApyFor24Hour,
  DailyApy
} from "../generated/schema"

export function handleLiquidityAdded(event: LiquidityAdded): void {
  // When liquidity is added, the supplied liquidity increases, along with available liquidity
}

export function handleLiquidityRemoved(event: LiquidityRemoved): void {
  // When liquidity is removed, the supplied liquidity decreases, along with available liquidity


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