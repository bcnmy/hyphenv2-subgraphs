import { Address, BigInt, log } from "@graphprotocol/graph-ts"
import {
  LiquidityPool,
  AssetSent,
  Deposit,
  EthReceived,
  FeeDetails,
  GasFeeWithdraw,
  LiquidityProvidersChanged,
  OwnershipTransferred,
  Paused,
  PauserChanged,
  Received,
  TrustedForwarderChanged,
  Unpaused
} from "../generated/LiquidityPool/LiquidityPool"

import {
  Deposit as DepositEntity,
  DailyDepositVolume,
  DepositVolumeCumulative,
  RollingDepositVolumeForLast24Hour,
  RollingDepositVolumeForLast24HourPerChainAndToken,
  FeeDetailLogEntry,
  FeeCumulative,
  DailyFeeDetailsLog,
  RollingFeeDetailsLogsForLast24Hour,
  UniqueWallet,
  UniqueWalletCount,
  DepositVolumeCumulativePerChainAndToken,
  DailyDepositVolumePerChainAndToken,
  AssetSentToUserLogEntry,
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

export function handleAssetSent(event: AssetSent): void {
  let assetSent = new AssetSentToUserLogEntry(event.transaction.hash.toHex());
  assetSent.tokenAddress = event.params.asset;
  assetSent.amount = event.params.amount;
  assetSent.transferredAmount = event.params.transferredAmount;
  assetSent.receiver = event.params.target;
  assetSent.depositHash = event.params.depositHash;
  assetSent.fromChainId = event.params.fromChainId;
  assetSent.timestamp = event.block.timestamp;

  assetSent.save();
  updateAvailableLiquidity(event.transaction.hash.toHex(), event.params.asset, event.block.timestamp, event.address);
}

export function handleDeposit(event: Deposit): void {
  updateAvailableLiquidity(event.transaction.hash.toHex(), event.params.tokenAddress, event.block.timestamp, event.address);
  const deposit = new DepositEntity(event.transaction.hash.toHex());
  deposit.sender = event.params.from;
  deposit.tokenAddress = event.params.tokenAddress;
  deposit.receiver = event.params.receiver;
  deposit.toChainID = event.params.toChainId;
  deposit.rewardAmount = event.params.reward;
  deposit.amount = event.params.amount;
  deposit.tag = event.params.tag;
  deposit.timestamp = event.block.timestamp;

  log.info("Sender:", [deposit.sender.toHexString()]);
  log.info("Token Address:", [deposit.tokenAddress.toHexString()]);
  log.info("Receiver:", [deposit.receiver.toHexString()]);
  log.info("toChainid:", [deposit.toChainID.toString()]);
  log.info("RewardAmount:", [deposit.rewardAmount.toString()]);
  log.info("Amount:", [deposit.amount.toString()]);
  log.info("tag:", [deposit.tag.toString()]);

  let depositVolumeCumulative = DepositVolumeCumulative.load("0");
  if (!depositVolumeCumulative) {
    depositVolumeCumulative = new DepositVolumeCumulative("0");
    depositVolumeCumulative.cumulativeRewardAmount = BigInt.fromI32(0);
    depositVolumeCumulative.cumulativeAmount = BigInt.fromI32(0);
    depositVolumeCumulative.count = BigInt.fromI32(0);
  }

  depositVolumeCumulative.cumulativeRewardAmount += deposit.rewardAmount;
  depositVolumeCumulative.cumulativeAmount += deposit.amount;
  depositVolumeCumulative.count += BigInt.fromI32(1);
  depositVolumeCumulative.save();

  let depositVolumeCumulativePerChainAndToken = DepositVolumeCumulativePerChainAndToken.load(`${deposit.toChainID.toString()}-${deposit.tokenAddress.toHexString()}`);
  if (!depositVolumeCumulativePerChainAndToken) {
    depositVolumeCumulativePerChainAndToken = new DepositVolumeCumulativePerChainAndToken(`${deposit.toChainID.toString()}-${deposit.tokenAddress.toHexString()}`);
    depositVolumeCumulativePerChainAndToken.cumulativeAmount = BigInt.fromI32(0);
    depositVolumeCumulativePerChainAndToken.cumulativeRewardAmount = BigInt.fromI32(0);
    depositVolumeCumulativePerChainAndToken.tokenAddress = deposit.tokenAddress;
    depositVolumeCumulativePerChainAndToken.toChainID = deposit.toChainID;
    depositVolumeCumulativePerChainAndToken.count = BigInt.fromI32(0);
  }

  depositVolumeCumulativePerChainAndToken.cumulativeAmount += deposit.amount;
  depositVolumeCumulativePerChainAndToken.cumulativeRewardAmount += deposit.rewardAmount;
  depositVolumeCumulativePerChainAndToken.count += BigInt.fromI32(1);


  depositVolumeCumulativePerChainAndToken.save();


  let slidingWindow = RollingDepositVolumeForLast24Hour.load("0");

  if (!slidingWindow) {
    slidingWindow = new RollingDepositVolumeForLast24Hour("0");
    slidingWindow.cumulativeRewardAmount = BigInt.fromI32(0);
    slidingWindow.cumulativeAmount = BigInt.fromI32(0);
    slidingWindow.count = BigInt.fromI32(0);
  }

  // add the current feeDetailLogEntry to the sliding window
  deposit.rollingWindow = slidingWindow.id;

  // add the current feeDetailLogEntry to the cumulative values
  slidingWindow.cumulativeRewardAmount += deposit.rewardAmount;
  slidingWindow.cumulativeAmount += deposit.amount;
  slidingWindow.count += BigInt.fromI32(1);

  let slidingWindowPerChainAndToken = RollingDepositVolumeForLast24HourPerChainAndToken.load(`${deposit.toChainID.toString()}-${deposit.tokenAddress.toHexString()}`);

  if (!slidingWindowPerChainAndToken) {
    slidingWindowPerChainAndToken = new RollingDepositVolumeForLast24HourPerChainAndToken(`${deposit.toChainID.toString()}-${deposit.tokenAddress.toHexString()}`);
    slidingWindowPerChainAndToken.toChainID = deposit.toChainID;
    slidingWindowPerChainAndToken.tokenAddress = deposit.tokenAddress;
    slidingWindowPerChainAndToken.cumulativeRewardAmount = BigInt.fromI32(0);
    slidingWindowPerChainAndToken.cumulativeAmount = BigInt.fromI32(0);
    slidingWindowPerChainAndToken.count = BigInt.fromI32(0);
  }

  slidingWindowPerChainAndToken.cumulativeRewardAmount += deposit.rewardAmount;;
  slidingWindowPerChainAndToken.cumulativeAmount += deposit.amount;
  slidingWindowPerChainAndToken.count += BigInt.fromI32(1);
  slidingWindowPerChainAndToken.save();

  deposit.rollingWindowPerChainAndToken = slidingWindowPerChainAndToken.id;

  let oldDeposits = slidingWindow.deposits;
  if (oldDeposits !== null) {
    // sliding window calculation
    for (let i = 0; i < oldDeposits.length; i++) {
      // for every feeDetailLogEntry in the rolling window, check if they are old enough to remove
      // if so, then remove and also decrease their values from cumulative rolling window values
      let oldDeposit = DepositEntity.load(oldDeposits[i]);
      if (!oldDeposit) continue;
      if (deposit.timestamp.minus(oldDeposit.timestamp) > BigInt.fromI32(86400)) {
        oldDeposit.rollingWindow = null;
        oldDeposit.save();
        slidingWindow.cumulativeRewardAmount = slidingWindow.cumulativeRewardAmount.minus(oldDeposit.rewardAmount);
        slidingWindow.cumulativeAmount = slidingWindow.cumulativeAmount.minus(oldDeposit.amount);
        slidingWindow.count -= BigInt.fromI32(1);
      }
    }
  }
  slidingWindow.save();

  let oldDepositsPerChainAndToken = slidingWindowPerChainAndToken.deposits;
  if (oldDepositsPerChainAndToken !== null) {
    for (let i = 0; i < oldDepositsPerChainAndToken.length; i++) {
      let oldDepositPerChainAndToken = DepositEntity.load(oldDepositsPerChainAndToken[i]);
      if (!oldDepositPerChainAndToken) continue;
      if (deposit.timestamp.minus(oldDepositPerChainAndToken.timestamp) > BigInt.fromI32(86400)) {
        oldDepositPerChainAndToken.rollingWindowPerChainAndToken = null;
        oldDepositPerChainAndToken.save();
        slidingWindowPerChainAndToken.cumulativeRewardAmount = slidingWindowPerChainAndToken.cumulativeRewardAmount.minus(oldDepositPerChainAndToken.rewardAmount);
        slidingWindowPerChainAndToken.cumulativeAmount = slidingWindowPerChainAndToken.cumulativeAmount.minus(oldDepositPerChainAndToken.amount);
        slidingWindowPerChainAndToken.count -= BigInt.fromI32(1);

      }
    }
  }
  slidingWindowPerChainAndToken.save();

  const epochModSecondsInADay = deposit.timestamp.mod(BigInt.fromI32(86400));
  const dayEpoch = deposit.timestamp.minus(epochModSecondsInADay);

  let todayDepositVolume = DailyDepositVolume.load(dayEpoch.toString());

  if (!todayDepositVolume) {
    todayDepositVolume = new DailyDepositVolume(dayEpoch.toString());
    todayDepositVolume.cumulativeRewardAmount = BigInt.fromI32(0);
    todayDepositVolume.cumulativeAmount = BigInt.fromI32(0);
    todayDepositVolume.count = BigInt.fromI32(0);
    todayDepositVolume.timestamp = dayEpoch;
  }

  let todayDepositVolumePerChainAndToken = DailyDepositVolumePerChainAndToken.load(`${dayEpoch.toString()}-${deposit.toChainID.toString()}-${deposit.tokenAddress.toHexString()}`);
  if (!todayDepositVolumePerChainAndToken) {
    todayDepositVolumePerChainAndToken = new DailyDepositVolumePerChainAndToken(`${dayEpoch.toString()}-${deposit.toChainID.toString()}-${deposit.tokenAddress.toHexString()}`);
    todayDepositVolumePerChainAndToken.cumulativeAmount = BigInt.fromI32(0);
    todayDepositVolumePerChainAndToken.cumulativeRewardAmount = BigInt.fromI32(0);
    todayDepositVolumePerChainAndToken.toChainID = deposit.toChainID;
    todayDepositVolumePerChainAndToken.tokenAddress = deposit.tokenAddress;
    todayDepositVolumePerChainAndToken.count = BigInt.fromI32(0);
    todayDepositVolumePerChainAndToken.timestamp = dayEpoch;
  }

  todayDepositVolumePerChainAndToken.cumulativeRewardAmount += deposit.rewardAmount;
  todayDepositVolumePerChainAndToken.cumulativeAmount += deposit.amount;
  todayDepositVolumePerChainAndToken.count += BigInt.fromI32(1);


  log.info("Today deposit epoch {}", [todayDepositVolume.id]);

  todayDepositVolume.cumulativeRewardAmount += deposit.rewardAmount;
  todayDepositVolume.cumulativeAmount += deposit.amount;
  todayDepositVolume.count += BigInt.fromI32(1);


  deposit.dailyWindow = todayDepositVolume.id;
  deposit.dailyWindowPerChainAndToken = todayDepositVolumePerChainAndToken.id;
  deposit.save();
  todayDepositVolume.save();
  todayDepositVolumePerChainAndToken.save();


  let uniqueWallet = UniqueWallet.load(event.params.from.toHex());
  log.info('hexString: {}', [event.params.from.toHexString()]);

  if (uniqueWallet == null) {
    let uniqueWalletCount = UniqueWalletCount.load('0')

    if (uniqueWalletCount == null) {
      uniqueWalletCount = new UniqueWalletCount('0')
      uniqueWalletCount.count = BigInt.fromI32(0)
    }

    let uniqueWalletCountPerToken = UniqueWalletCount.load(event.params.tokenAddress.toHexString())

    if (uniqueWalletCountPerToken == null) {
      uniqueWalletCountPerToken = new UniqueWalletCount(event.params.tokenAddress.toHexString())
      uniqueWalletCountPerToken.count = BigInt.fromI32(0)
    }

    uniqueWallet = new UniqueWallet(event.params.from.toHexString())
    uniqueWallet.count = BigInt.fromI32(0)

    uniqueWalletCount.count = (uniqueWalletCount.count).plus(BigInt.fromI32(1));

    uniqueWalletCountPerToken.count = (uniqueWalletCountPerToken.count).plus(BigInt.fromI32(1));

    uniqueWalletCount.save()
    uniqueWalletCountPerToken.save()
  }

  uniqueWallet.count = (uniqueWallet.count).plus(BigInt.fromI32(1));
  uniqueWallet.save()
}

// export function handleEthReceived(event: EthReceived): void { }

export function handleFeeDetails(event: FeeDetails): void {
  log.info("Inside Fee Details:", ["Feels good"]);
  // FeeDetail is the fundamental entity
  const feeDetailLogEntry = new FeeDetailLogEntry(event.transaction.hash.toHex());
  feeDetailLogEntry.timestamp = event.block.timestamp;
  feeDetailLogEntry.transferFee = event.params.transferFee;
  feeDetailLogEntry.lpFee = event.params.lpFee;
  feeDetailLogEntry.gasFee = event.params.gasFee;
  log.info("Fee Detail log entry populated", ["Feels good"]);


  // log.info("tran:", [deposit.sender.toHexString()]);
  // log.info("Token Address:", [deposit.tokenAddress.toHexString()]);
  // log.info("Receiver:", [deposit.receiver.toHexString()]);
  // log.info("toChainid:", [deposit.toChainID.toString()]);
  // log.info("RewardAmount:", [deposit.rewardAmount.toString()]);
  // log.info("Amount:", [deposit.amount.toString()]);
  // log.info("tag:", [deposit.tag.toString()]);

  // FeeCumulative is the cumulative all time data
  let feeCumulative = FeeCumulative.load("0");

  if (!feeCumulative) {
    feeCumulative = new FeeCumulative("0");
    feeCumulative.lpFee = BigInt.fromI32(0);
    feeCumulative.gasFee = BigInt.fromI32(0);
    feeCumulative.transferFee = BigInt.fromI32(0);
    feeCumulative.count = BigInt.fromI32(0);
  }

  feeCumulative.lpFee = feeCumulative.lpFee.plus(feeDetailLogEntry.lpFee);
  feeCumulative.gasFee = feeCumulative.gasFee.plus(feeDetailLogEntry.gasFee);
  feeCumulative.transferFee = feeCumulative.transferFee.plus(feeDetailLogEntry.transferFee);
  feeCumulative.count += BigInt.fromI32(1);

  feeCumulative.save();

  log.info("Fee Cumulative saved", ["Feels good"]);


  // RollingFeeDetailsLogsForLast24Hour only captures data for the last 24 hours, counting from the last event
  let slidingWindow = RollingFeeDetailsLogsForLast24Hour.load("0");

  if (!slidingWindow) {
    slidingWindow = new RollingFeeDetailsLogsForLast24Hour("0");
    slidingWindow.cumulativeGasFee = BigInt.fromI32(0);
    slidingWindow.cumulativeLpFee = BigInt.fromI32(0);
    slidingWindow.cumulativeTransferFee = BigInt.fromI32(0);
    slidingWindow.count = BigInt.fromI32(0);
  }

  // add the current feeDetailLogEntry to the sliding window
  feeDetailLogEntry.rollingWindow = slidingWindow.id;

  // add the current feeDetailLogEntry to the cumulative values
  slidingWindow.cumulativeGasFee += feeDetailLogEntry.gasFee;
  slidingWindow.cumulativeLpFee += feeDetailLogEntry.lpFee;
  slidingWindow.cumulativeTransferFee += feeDetailLogEntry.transferFee;
  slidingWindow.count += BigInt.fromI32(1);

  log.info("Sliding window added values {} {} {}",
    [slidingWindow.cumulativeGasFee.toString(),
    slidingWindow.cumulativeLpFee.toString(),
    slidingWindow.cumulativeTransferFee.toString()]
  );

  //let oldLogs = slidingWindow.logs;
  log.info("assigned old logs", []);

  let oldFees = slidingWindow.logs;
  if (oldFees !== null) {
    // sliding window calculation
    for (let i = 0; i < oldFees.length; i++) {
      // for every feeDetailLogEntry in the rolling window, check if they are old enough to remove
      // if so, then remove and also decrease their values from cumulative rolling window values
      let oldFee = FeeDetailLogEntry.load(oldFees[i]);
      if (!oldFee) continue;
      if (feeDetailLogEntry.timestamp.minus(oldFee.timestamp) > BigInt.fromI32(86400)) {
        oldFee.rollingWindow = null;
        oldFee.save();
        slidingWindow.cumulativeGasFee = slidingWindow.cumulativeGasFee.minus(oldFee.gasFee);
        slidingWindow.cumulativeLpFee = slidingWindow.cumulativeLpFee.minus(oldFee.lpFee);
        slidingWindow.cumulativeTransferFee = slidingWindow.cumulativeTransferFee.minus(oldFee.transferFee);
        slidingWindow.count -= BigInt.fromI32(1);
      }
    }
  }

  log.info("skipped", []);

  slidingWindow.save();
  log.info("Sliding window saved", ["Feels good"]);

  const epochModSecondsInADay = feeDetailLogEntry.timestamp.mod(BigInt.fromI32(86400));

  log.info("Day epoch {}", [epochModSecondsInADay.toString()]);

  const dayEpoch = feeDetailLogEntry.timestamp.minus(epochModSecondsInADay);

  let todayFeeDetailsLog = DailyFeeDetailsLog.load(dayEpoch.toString());

  if (!todayFeeDetailsLog) {
    todayFeeDetailsLog = new DailyFeeDetailsLog(dayEpoch.toString());
    todayFeeDetailsLog.cumulativeGasFee = BigInt.fromI32(0);
    todayFeeDetailsLog.cumulativeLpFee = BigInt.fromI32(0);
    todayFeeDetailsLog.cumulativeTransferFee = BigInt.fromI32(0);
    todayFeeDetailsLog.count = BigInt.fromI32(0);
    todayFeeDetailsLog.timestamp = dayEpoch;
  }

  todayFeeDetailsLog.cumulativeGasFee = todayFeeDetailsLog.cumulativeGasFee.plus(feeDetailLogEntry.gasFee);
  todayFeeDetailsLog.cumulativeLpFee = todayFeeDetailsLog.cumulativeLpFee.plus(feeDetailLogEntry.lpFee);
  todayFeeDetailsLog.cumulativeTransferFee = todayFeeDetailsLog.cumulativeTransferFee.plus(feeDetailLogEntry.transferFee);
  todayFeeDetailsLog.count += BigInt.fromI32(1);

  feeDetailLogEntry.dailyWindow = todayFeeDetailsLog.id;
  feeDetailLogEntry.save();
  log.info("fee detail log entry saved", ["Feels good"]);
  todayFeeDetailsLog.save();
  log.info("today fee saved", ["Feels good"]);

}

// export function handleGasFeeWithdraw(event: GasFeeWithdraw): void { }

// export function handleLiquidityProvidersChanged(
//   event: LiquidityProvidersChanged
// ): void { }

// export function handleOwnershipTransferred(event: OwnershipTransferred): void { }

// export function handlePaused(event: Paused): void { }

// export function handlePauserChanged(event: PauserChanged): void { }

// export function handleReceived(event: Received): void { }

// export function handleTrustedForwarderChanged(
//   event: TrustedForwarderChanged
// ): void { }

// export function handleUnpaused(event: Unpaused): void { }
