import {
  Address,
  BigInt,
  log,
  BigDecimal,
  Bytes,
} from "@graphprotocol/graph-ts";
import {
  LiquidityPool,
  AssetSent,
  Deposit,
  EthReceived,
  GasFeeWithdraw,
  LiquidityProvidersChanged,
  OwnershipTransferred,
  Paused,
  PauserChanged,
  Received,
  TrustedForwarderChanged,
  Unpaused,
  DepositAndSwap
} from "../generated/LiquidityPool/LiquidityPool";

import {
  TokenPriceInLPSharesLog,
  RollingApyFor24Hour,
  DailyApy,
  Deposit as DepositEntity,
  DailyDepositVolume,
  DepositVolumeCumulative,
  RollingDepositVolumeForLast24Hour,
  RollingDepositVolumeForLast24HourPerChainAndToken,
  UniqueWallet,
  UniqueWalletCount,
  DepositVolumeCumulativePerChainAndToken,
  DailyDepositVolumePerChainAndToken,
  AssetSentToUserLogEntry,
  AvailableLiquidityLogEntry,
  HourlyAvailableLiquidity,
  RollingAvailableLiquidityForLast24Hour,
  SuppliedLiquidityLogEntry,
  HourlySuppliedLiquidity,
  RollingSuppliedLiquidityForLast24Hour,
  IncentivePoolBalanceLogEntry,
  HourlyIncentivePoolBalance,
  RollingIncentivePoolBalanceForLast24Hour,
  DailyAssetSentPerFromChainAndToken,
  RollingAssetSentForLast24HoursPerChainAndToken,
  HourlyDepositVolumePerChainAndToken,
  HourlyDeposit,
  HourlyAssetSent,
  DepositAndSwap as DepositAndSwapEntity
  // SwapRequest
} from "../generated/schema";

export function updateAvailableLiquidity(
  txId: string,
  tokenAddress: Address,
  timestamp: BigInt,
  eventAddress: Address
): void {
  const liquidityPoolContract = LiquidityPool.bind(eventAddress);
  const currentAvailableLiquidity = liquidityPoolContract.getCurrentLiquidity(
    tokenAddress
  );

  const logKey = `${txId}-${tokenAddress.toHex()}`;
  let availableLiquidityLogEntry = AvailableLiquidityLogEntry.load(logKey);
  if (!availableLiquidityLogEntry) {
    availableLiquidityLogEntry = new AvailableLiquidityLogEntry(logKey);
    availableLiquidityLogEntry.tokenAddress = tokenAddress;
    availableLiquidityLogEntry.timestamp = timestamp;
  } else {
    availableLiquidityLogEntry.availableLiquidity = currentAvailableLiquidity;
    availableLiquidityLogEntry.save();
    return;
  }

  const epochModSecondsInAHour = timestamp.mod(BigInt.fromI32(3600));
  const hourEpoch = timestamp.minus(epochModSecondsInAHour);

  let hourlyAvailableLiquidity = HourlyAvailableLiquidity.load(
    `${tokenAddress.toHex()}-${hourEpoch.toString()}`
  );
  if (!hourlyAvailableLiquidity) {
    hourlyAvailableLiquidity = new HourlyAvailableLiquidity(
      tokenAddress.toHex()
    );
    hourlyAvailableLiquidity.availableLiquidity = BigInt.fromI32(0);
    hourlyAvailableLiquidity.tokenAddress = tokenAddress;
    hourlyAvailableLiquidity.timestamp = hourEpoch;
    hourlyAvailableLiquidity.count = BigInt.fromI32(0);
  }

  hourlyAvailableLiquidity.count = hourlyAvailableLiquidity.count.plus(
    BigInt.fromI32(1)
  );
  hourlyAvailableLiquidity.availableLiquidity = hourlyAvailableLiquidity.availableLiquidity
    .times(hourlyAvailableLiquidity.count)
    .plus(currentAvailableLiquidity)
    .div(hourlyAvailableLiquidity.count);
  hourlyAvailableLiquidity.save();

  let availableLiquidityRollingWindow = RollingAvailableLiquidityForLast24Hour.load(
    tokenAddress.toHex()
  );
  if (!availableLiquidityRollingWindow) {
    availableLiquidityRollingWindow = new RollingAvailableLiquidityForLast24Hour(
      tokenAddress.toHex()
    );
    availableLiquidityRollingWindow.tokenAddress = tokenAddress;
    availableLiquidityRollingWindow.availableLiquidity = BigInt.fromI32(0);
    availableLiquidityRollingWindow.count = BigInt.fromI32(0);
    availableLiquidityRollingWindow.logs = new Array<string>();
  }

  availableLiquidityRollingWindow.count = availableLiquidityRollingWindow.count.plus(
    BigInt.fromI32(1)
  );
  availableLiquidityRollingWindow.availableLiquidity = availableLiquidityRollingWindow.availableLiquidity
    .times(availableLiquidityRollingWindow.count)
    .plus(currentAvailableLiquidity)
    .div(availableLiquidityRollingWindow.count);

  let oldAvailableLiquidityLogs = availableLiquidityRollingWindow.logs;
  let newAvailableLiquidityLogs = new Array<string>();
  newAvailableLiquidityLogs.push(availableLiquidityLogEntry.id);

  // sliding window calculation
  for (let i = 0; i < oldAvailableLiquidityLogs.length; i++) {
    // for every feeDetailLogEntry in the rolling window, check if they are old enough to remove
    // if so, then remove and also decrease their values from cumulative rolling window values
    let oldAvailableLiquidityLog = AvailableLiquidityLogEntry.load(
      oldAvailableLiquidityLogs[i]
    );
    if (!oldAvailableLiquidityLog) continue;
    if (
      timestamp.minus(oldAvailableLiquidityLog.timestamp) > BigInt.fromI32(3600)
    ) {
      availableLiquidityRollingWindow.count = availableLiquidityRollingWindow.count.minus(
        BigInt.fromI32(1)
      );
      availableLiquidityRollingWindow.availableLiquidity = availableLiquidityRollingWindow.availableLiquidity
        .times(availableLiquidityRollingWindow.count)
        .minus(oldAvailableLiquidityLog.availableLiquidity)
        .div(availableLiquidityRollingWindow.count);
    } else {
      newAvailableLiquidityLogs.push(oldAvailableLiquidityLog.id);
    }
  }
  availableLiquidityRollingWindow.logs = newAvailableLiquidityLogs;
  availableLiquidityRollingWindow.save();
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
  assetSent.lpFee = event.params.lpFee;
  assetSent.lpFeePercent = event.params.lpFee
    .divDecimal(assetSent.amount.toBigDecimal())
    .times(BigInt.fromI32(100).toBigDecimal());
  assetSent.transferFee = event.params.transferFee;
  assetSent.transferFeePercent = event.params.transferFee
    .divDecimal(assetSent.amount.toBigDecimal())
    .times(BigInt.fromI32(100).toBigDecimal());
  assetSent.gasFee = event.params.gasFee;
  assetSent.gasFeePercent = event.params.gasFee
    .divDecimal(assetSent.amount.toBigDecimal())
    .times(BigInt.fromI32(100).toBigDecimal());

  assetSent.save();

  const epochModSecondsInAnHour = assetSent.timestamp.mod(BigInt.fromI32(3600));
  const hourEpoch = assetSent.timestamp.minus(epochModSecondsInAnHour);

  let hourlyAssetSent = HourlyAssetSent.load(`${hourEpoch}-${assetSent.tokenAddress.toHex()}-${assetSent.fromChainId}`);
  if (!hourlyAssetSent) {
    hourlyAssetSent = new HourlyAssetSent(`${hourEpoch}-${assetSent.tokenAddress.toHex()}-${assetSent.fromChainId}`);

    hourlyAssetSent.timestamp = hourEpoch;
    hourlyAssetSent.fromChainId = assetSent.fromChainId;
    hourlyAssetSent.tokenAddress = assetSent.tokenAddress;

    hourlyAssetSent.count = BigInt.fromI32(0);

    hourlyAssetSent.cumulativeTransferredAmount = BigInt.fromI32(0);
    hourlyAssetSent.cumulativeAmount = BigInt.fromI32(0);

    hourlyAssetSent.cumulativeGasFee = BigInt.fromI32(0);
    hourlyAssetSent.cumulativeLpFee = BigInt.fromI32(0);
    hourlyAssetSent.cumulativeTransferFee = BigInt.fromI32(0);

    hourlyAssetSent.averageGasFeePercent = BigInt.fromI32(0).toBigDecimal();
    hourlyAssetSent.averageLpFeePercent = BigInt.fromI32(0).toBigDecimal();
    hourlyAssetSent.averageTransferFeePercent = BigInt.fromI32(0).toBigDecimal();
  }

  hourlyAssetSent.cumulativeAmount = hourlyAssetSent.cumulativeAmount.plus(assetSent.amount);
  hourlyAssetSent.cumulativeTransferredAmount = hourlyAssetSent.cumulativeTransferredAmount.plus(assetSent.transferredAmount);

  hourlyAssetSent.cumulativeGasFee = hourlyAssetSent.cumulativeGasFee.plus(assetSent.gasFee);
  hourlyAssetSent.cumulativeLpFee = hourlyAssetSent.cumulativeLpFee.plus(assetSent.lpFee);
  hourlyAssetSent.cumulativeTransferFee = hourlyAssetSent.cumulativeTransferFee.plus(assetSent.transferFee);

  hourlyAssetSent.averageGasFeePercent = hourlyAssetSent.averageGasFeePercent
    .times(hourlyAssetSent.count.toBigDecimal())
    .plus(assetSent.gasFeePercent)
    .div(hourlyAssetSent.count.plus(BigInt.fromI32(1)).toBigDecimal())

  hourlyAssetSent.averageLpFeePercent = hourlyAssetSent.averageLpFeePercent
    .times(hourlyAssetSent.count.toBigDecimal())
    .plus(assetSent.lpFeePercent)
    .div(hourlyAssetSent.count.plus(BigInt.fromI32(1)).toBigDecimal());

  hourlyAssetSent.averageTransferFeePercent = hourlyAssetSent.averageTransferFeePercent
    .times(hourlyAssetSent.count.toBigDecimal())
    .plus(assetSent.transferFeePercent)
    .div(hourlyAssetSent.count.plus(BigInt.fromI32(1)).toBigDecimal());

  hourlyAssetSent.count = hourlyAssetSent.count.plus(BigInt.fromI32(1));

  hourlyAssetSent.save()

  const epochModSecondsInADay = assetSent.timestamp.mod(BigInt.fromI32(86400));
  const dayEpoch = assetSent.timestamp.minus(epochModSecondsInADay);

  let dailyAssetSentPerFromChainAndToken = DailyAssetSentPerFromChainAndToken.load(
    `${assetSent.fromChainId.toString()}-${assetSent.tokenAddress.toHexString()}-${dayEpoch}`
  );

  if (!dailyAssetSentPerFromChainAndToken) {
    dailyAssetSentPerFromChainAndToken = new DailyAssetSentPerFromChainAndToken(
      `${assetSent.fromChainId.toString()}-${assetSent.tokenAddress.toHexString()}-${dayEpoch}`
    );
    dailyAssetSentPerFromChainAndToken.fromChainId = assetSent.fromChainId;
    dailyAssetSentPerFromChainAndToken.tokenAddress = assetSent.tokenAddress;
    dailyAssetSentPerFromChainAndToken.cumulativeAmount = BigInt.fromI32(0);
    dailyAssetSentPerFromChainAndToken.cumulativeTransferredAmount = BigInt.fromI32(
      0
    );
    dailyAssetSentPerFromChainAndToken.count = BigInt.fromI32(0);
    dailyAssetSentPerFromChainAndToken.cumulativeLpFee = BigInt.fromI32(0);
    dailyAssetSentPerFromChainAndToken.averageLpFeePercent = BigInt.fromI32(
      0
    ).toBigDecimal();
    dailyAssetSentPerFromChainAndToken.cumulativeTransferFee = BigInt.fromI32(
      0
    );
    dailyAssetSentPerFromChainAndToken.averageTransferFeePercent = BigInt.fromI32(
      0
    ).toBigDecimal();
    dailyAssetSentPerFromChainAndToken.cumulativeGasFee = BigInt.fromI32(0);
    dailyAssetSentPerFromChainAndToken.averageGasFeePercent = BigInt.fromI32(
      0
    ).toBigDecimal();
    dailyAssetSentPerFromChainAndToken.timestamp = dayEpoch;
  }

  dailyAssetSentPerFromChainAndToken.cumulativeAmount = dailyAssetSentPerFromChainAndToken.cumulativeAmount.plus(
    assetSent.amount
  );
  dailyAssetSentPerFromChainAndToken.cumulativeTransferredAmount = dailyAssetSentPerFromChainAndToken.cumulativeTransferredAmount.plus(
    assetSent.transferredAmount
  );

  dailyAssetSentPerFromChainAndToken.cumulativeLpFee = dailyAssetSentPerFromChainAndToken.cumulativeLpFee.plus(
    assetSent.lpFee
  );
  dailyAssetSentPerFromChainAndToken.averageLpFeePercent = dailyAssetSentPerFromChainAndToken.averageLpFeePercent
    .times(dailyAssetSentPerFromChainAndToken.count.toBigDecimal())
    .plus(assetSent.lpFeePercent)
    .div(
      dailyAssetSentPerFromChainAndToken.count
        .toBigDecimal()
        .plus(BigInt.fromI32(1).toBigDecimal())
    );

  dailyAssetSentPerFromChainAndToken.cumulativeGasFee = dailyAssetSentPerFromChainAndToken.cumulativeGasFee.plus(
    assetSent.gasFee
  );
  dailyAssetSentPerFromChainAndToken.averageGasFeePercent = dailyAssetSentPerFromChainAndToken.averageGasFeePercent
    .times(dailyAssetSentPerFromChainAndToken.count.toBigDecimal())
    .plus(assetSent.gasFeePercent)
    .div(
      dailyAssetSentPerFromChainAndToken.count
        .toBigDecimal()
        .plus(BigInt.fromI32(1).toBigDecimal())
    );

  dailyAssetSentPerFromChainAndToken.cumulativeTransferFee = dailyAssetSentPerFromChainAndToken.cumulativeTransferFee.plus(
    assetSent.transferFee
  );
  dailyAssetSentPerFromChainAndToken.averageTransferFeePercent = dailyAssetSentPerFromChainAndToken.averageTransferFeePercent
    .times(dailyAssetSentPerFromChainAndToken.count.toBigDecimal())
    .plus(assetSent.transferFeePercent)
    .div(
      dailyAssetSentPerFromChainAndToken.count
        .toBigDecimal()
        .plus(BigInt.fromI32(1).toBigDecimal())
    );

  dailyAssetSentPerFromChainAndToken.count = dailyAssetSentPerFromChainAndToken.count.plus(
    BigInt.fromI32(1)
  );
  log.info("daily Asset sent count increased", []);

  dailyAssetSentPerFromChainAndToken.save();

  let assetSentRollingWindow = RollingAssetSentForLast24HoursPerChainAndToken.load(
    `${assetSent.fromChainId.toString()}-${assetSent.tokenAddress.toHexString()}`
  );
  if (!assetSentRollingWindow) {
    assetSentRollingWindow = new RollingAssetSentForLast24HoursPerChainAndToken(
      `${assetSent.fromChainId.toString()}-${assetSent.tokenAddress.toHexString()}`
    );
    assetSentRollingWindow.fromChainId = assetSent.fromChainId;
    assetSentRollingWindow.tokenAddress = assetSent.tokenAddress;
    assetSentRollingWindow.cumulativeAmount = BigInt.fromI32(0);
    assetSentRollingWindow.cumulativeTransferredAmount = BigInt.fromI32(0);
    assetSentRollingWindow.count = BigInt.fromI32(0);

    assetSentRollingWindow.cumulativeLpFee = BigInt.fromI32(0);
    assetSentRollingWindow.averageLpFeePercent = BigInt.fromI32(
      0
    ).toBigDecimal();

    assetSentRollingWindow.cumulativeTransferFee = BigInt.fromI32(0);
    assetSentRollingWindow.averageTransferFeePercent = BigInt.fromI32(
      0
    ).toBigDecimal();

    assetSentRollingWindow.cumulativeGasFee = BigInt.fromI32(0);
    assetSentRollingWindow.averageGasFeePercent = BigInt.fromI32(
      0
    ).toBigDecimal();

    assetSentRollingWindow.assetSentLogs = new Array<string>();
  }

  assetSentRollingWindow.cumulativeAmount = dailyAssetSentPerFromChainAndToken.cumulativeAmount.plus(
    assetSent.amount
  );
  assetSentRollingWindow.cumulativeTransferredAmount = dailyAssetSentPerFromChainAndToken.cumulativeTransferredAmount.plus(
    assetSent.transferredAmount
  );

  assetSentRollingWindow.cumulativeLpFee = dailyAssetSentPerFromChainAndToken.cumulativeLpFee.plus(
    assetSent.lpFee
  );
  assetSentRollingWindow.averageLpFeePercent = dailyAssetSentPerFromChainAndToken.averageLpFeePercent
    .times(assetSentRollingWindow.count.toBigDecimal())
    .plus(assetSent.lpFeePercent)
    .div(
      assetSentRollingWindow.count
        .toBigDecimal()
        .plus(BigInt.fromI32(1).toBigDecimal())
    );

  assetSentRollingWindow.cumulativeGasFee = dailyAssetSentPerFromChainAndToken.cumulativeGasFee.plus(
    assetSent.gasFee
  );
  assetSentRollingWindow.averageGasFeePercent = dailyAssetSentPerFromChainAndToken.averageGasFeePercent
    .times(assetSentRollingWindow.count.toBigDecimal())
    .plus(assetSent.gasFeePercent)
    .div(
      assetSentRollingWindow.count
        .toBigDecimal()
        .plus(BigInt.fromI32(1).toBigDecimal())
    );

  assetSentRollingWindow.cumulativeTransferFee = dailyAssetSentPerFromChainAndToken.cumulativeTransferFee.plus(
    assetSent.transferFee
  );
  assetSentRollingWindow.averageTransferFeePercent = dailyAssetSentPerFromChainAndToken.averageTransferFeePercent
    .times(assetSentRollingWindow.count.toBigDecimal())
    .plus(assetSent.transferFeePercent)
    .div(
      assetSentRollingWindow.count
        .toBigDecimal()
        .plus(BigInt.fromI32(1).toBigDecimal())
    );

  assetSentRollingWindow.count = assetSentRollingWindow.count.plus(
    BigInt.fromI32(1)
  );

  let oldAssetSentLogs = assetSentRollingWindow.assetSentLogs;

  while (true) {
    if (oldAssetSentLogs.length > 0) {
      let oldAssetSentLog = AssetSentToUserLogEntry.load(oldAssetSentLogs[0]);
      if (!oldAssetSentLog) continue;
      if (
        assetSent.timestamp
          .minus(oldAssetSentLog.timestamp)
          .gt(BigInt.fromI32(86400))
      ) {
        assetSentRollingWindow.cumulativeAmount = assetSentRollingWindow.cumulativeAmount.minus(
          oldAssetSentLog.amount
        );
        assetSentRollingWindow.cumulativeTransferredAmount = assetSentRollingWindow.cumulativeTransferredAmount.minus(
          oldAssetSentLog.transferredAmount
        );

        assetSentRollingWindow.cumulativeGasFee = assetSentRollingWindow.cumulativeGasFee.minus(
          oldAssetSentLog.gasFee
        );
        assetSentRollingWindow.averageGasFeePercent = assetSentRollingWindow.averageGasFeePercent
          .times(assetSentRollingWindow.count.toBigDecimal())
          .minus(oldAssetSentLog.gasFeePercent)
          .div(
            assetSentRollingWindow.count
              .toBigDecimal()
              .minus(BigInt.fromI32(1).toBigDecimal())
          );

        assetSentRollingWindow.cumulativeLpFee = assetSentRollingWindow.cumulativeLpFee.minus(
          oldAssetSentLog.lpFee
        );
        assetSentRollingWindow.averageLpFeePercent = assetSentRollingWindow.averageLpFeePercent
          .times(assetSentRollingWindow.count.toBigDecimal())
          .minus(oldAssetSentLog.lpFeePercent)
          .div(
            assetSentRollingWindow.count
              .toBigDecimal()
              .minus(BigInt.fromI32(1).toBigDecimal())
          );

        assetSentRollingWindow.cumulativeTransferFee = assetSentRollingWindow.cumulativeTransferFee.minus(
          oldAssetSentLog.transferFee
        );
        assetSentRollingWindow.averageTransferFeePercent = assetSentRollingWindow.averageTransferFeePercent
          .times(assetSentRollingWindow.count.toBigDecimal())
          .minus(oldAssetSentLog.transferFeePercent)
          .div(
            assetSentRollingWindow.count
              .toBigDecimal()
              .minus(BigInt.fromI32(1).toBigDecimal())
          );

        assetSentRollingWindow.count = assetSentRollingWindow.count.minus(
          BigInt.fromI32(1)
        );
        oldAssetSentLogs.shift();
        log.info("Asset sent count decreased", []);
      } else {
        break;
      }
    } else {
      break;
    }
  }

  oldAssetSentLogs.push(assetSent.id);
  assetSentRollingWindow.assetSentLogs = oldAssetSentLogs;
  assetSentRollingWindow.save();

  updateIncentivePoolBalance(
    event.transaction.hash.toHex(),
    event.params.asset,
    event.block.timestamp,
    event.address
  );
  updateAvailableLiquidity(
    event.transaction.hash.toHex(),
    event.params.asset,
    event.block.timestamp,
    event.address
  );
}

export function handleDeposit(event: Deposit): void {
  updateIncentivePoolBalance(
    event.transaction.hash.toHex(),
    event.params.tokenAddress,
    event.block.timestamp,
    event.address
  );
  updateAvailableLiquidity(
    event.transaction.hash.toHex(),
    event.params.tokenAddress,
    event.block.timestamp,
    event.address
  );
  const deposit = new DepositEntity(event.transaction.hash.toHex());
  deposit.sender = event.params.from;
  deposit.tokenAddress = event.params.tokenAddress;
  deposit.receiver = event.params.receiver;
  deposit.toChainID = event.params.toChainId;
  deposit.rewardAmount = event.params.reward;
  deposit.amount = event.params.amount;
  deposit.rewardAmountPercent = deposit.rewardAmount.divDecimal(deposit.amount.toBigDecimal()).times(BigInt.fromI32(100).toBigDecimal());
  deposit.tag = event.params.tag;
  deposit.timestamp = event.block.timestamp;

  const epochModSecondsInAnHour = deposit.timestamp.mod(BigInt.fromI32(3600));
  const hourEpoch = deposit.timestamp.minus(epochModSecondsInAnHour);

  let hourlyDeposit = HourlyDeposit.load(`${hourEpoch}-${deposit.tokenAddress.toHex()}-${deposit.toChainID}}`);
  if (!hourlyDeposit) {
    hourlyDeposit = new HourlyDeposit(`${hourEpoch}-${deposit.tokenAddress.toHex()}-${deposit.toChainID}}`);
    hourlyDeposit.timestamp = hourEpoch;
    hourlyDeposit.toChainID = deposit.toChainID;
    hourlyDeposit.tokenAddress = deposit.tokenAddress;

    hourlyDeposit.count = BigInt.fromI32(0);
    hourlyDeposit.averageRewardAmountPercent = BigInt.fromI32(0).toBigDecimal();
    hourlyDeposit.cumulativeAmount = BigInt.fromI32(0);
    hourlyDeposit.cumulativeRewardAmount = BigInt.fromI32(0)
  }

  hourlyDeposit.cumulativeAmount = hourlyDeposit.cumulativeAmount.plus(deposit.amount);
  hourlyDeposit.cumulativeRewardAmount = hourlyDeposit.cumulativeRewardAmount.plus(deposit.rewardAmount);
  hourlyDeposit.averageRewardAmountPercent = hourlyDeposit.averageRewardAmountPercent
    .times(hourlyDeposit.count.toBigDecimal())
    .plus(deposit.rewardAmountPercent)
    .div(hourlyDeposit.count.plus(BigInt.fromI32(1)).toBigDecimal());

  hourlyDeposit.count = hourlyDeposit.count.plus(BigInt.fromI32(1));

  hourlyDeposit.save()

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

  let depositVolumeCumulativePerChainAndToken = DepositVolumeCumulativePerChainAndToken.load(
    `${deposit.toChainID.toString()} - ${deposit.tokenAddress.toHexString()}`
  );
  if (!depositVolumeCumulativePerChainAndToken) {
    depositVolumeCumulativePerChainAndToken = new DepositVolumeCumulativePerChainAndToken(
      `${deposit.toChainID.toString()} - ${deposit.tokenAddress.toHexString()}`
    );
    depositVolumeCumulativePerChainAndToken.cumulativeAmount = BigInt.fromI32(
      0
    );
    depositVolumeCumulativePerChainAndToken.cumulativeRewardAmount = BigInt.fromI32(
      0
    );
    depositVolumeCumulativePerChainAndToken.tokenAddress = deposit.tokenAddress;
    depositVolumeCumulativePerChainAndToken.toChainID = deposit.toChainID;
    depositVolumeCumulativePerChainAndToken.count = BigInt.fromI32(0);
  }

  depositVolumeCumulativePerChainAndToken.cumulativeAmount += deposit.amount;
  depositVolumeCumulativePerChainAndToken.cumulativeRewardAmount +=
    deposit.rewardAmount;
  depositVolumeCumulativePerChainAndToken.count += BigInt.fromI32(1);

  depositVolumeCumulativePerChainAndToken.save();

  let slidingDepositWindow = RollingDepositVolumeForLast24Hour.load("0");

  if (!slidingDepositWindow) {
    slidingDepositWindow = new RollingDepositVolumeForLast24Hour("0");
    slidingDepositWindow.cumulativeRewardAmount = BigInt.fromI32(0);
    slidingDepositWindow.cumulativeAmount = BigInt.fromI32(0);
    slidingDepositWindow.count = BigInt.fromI32(0);
    slidingDepositWindow.deposits = new Array<string>();
  }

  // add the current feeDetailLogEntry to the sliding window
  // deposit.rollingWindow = slidingWindow.id;
  let oldDepositLogs = slidingDepositWindow.deposits;
  let newDepositLogs = new Array<string>();
  newDepositLogs.push(deposit.id);

  // add the current feeDetailLogEntry to the cumulative values
  slidingDepositWindow.cumulativeRewardAmount += deposit.rewardAmount;
  slidingDepositWindow.cumulativeAmount += deposit.amount;
  slidingDepositWindow.count += BigInt.fromI32(1);

  // sliding window calculation
  for (let i = 0; i < oldDepositLogs.length; i++) {
    // for every feeDetailLogEntry in the rolling window, check if they are old enough to remove
    // if so, then remove and also decrease their values from cumulative rolling window values
    let oldDeposit = DepositEntity.load(oldDepositLogs[i]);
    log.info("Loaded old deposits", []);
    if (!oldDeposit) continue;
    if (deposit.timestamp.minus(oldDeposit.timestamp) > BigInt.fromI32(86400)) {
      slidingDepositWindow.cumulativeRewardAmount = slidingDepositWindow.cumulativeRewardAmount.minus(
        oldDeposit.rewardAmount
      );
      slidingDepositWindow.cumulativeAmount = slidingDepositWindow.cumulativeAmount.minus(
        oldDeposit.amount
      );
      slidingDepositWindow.count -= BigInt.fromI32(1);
    } else {
      newDepositLogs.push(oldDeposit.id);
    }
    log.info("Exiting for loop", []);
  }
  slidingDepositWindow.deposits = newDepositLogs;
  slidingDepositWindow.save();

  let slidingWindowPerChainAndToken = RollingDepositVolumeForLast24HourPerChainAndToken.load(
    `${deposit.toChainID.toString()} - ${deposit.tokenAddress.toHexString()}`
  );

  if (!slidingWindowPerChainAndToken) {
    slidingWindowPerChainAndToken = new RollingDepositVolumeForLast24HourPerChainAndToken(
      `${deposit.toChainID.toString()} - ${deposit.tokenAddress.toHexString()}`
    );
    slidingWindowPerChainAndToken.toChainID = deposit.toChainID;
    slidingWindowPerChainAndToken.tokenAddress = deposit.tokenAddress;
    slidingWindowPerChainAndToken.cumulativeRewardAmount = BigInt.fromI32(0);
    slidingWindowPerChainAndToken.cumulativeAmount = BigInt.fromI32(0);
    slidingWindowPerChainAndToken.count = BigInt.fromI32(0);
    slidingWindowPerChainAndToken.deposits = new Array<string>();
    slidingWindowPerChainAndToken.firstDeposit = deposit.id;
  }

  slidingWindowPerChainAndToken.cumulativeRewardAmount += deposit.rewardAmount;
  slidingWindowPerChainAndToken.cumulativeAmount += deposit.amount;
  slidingWindowPerChainAndToken.count += BigInt.fromI32(1);
  slidingWindowPerChainAndToken.lastDeposit = deposit.id;
  slidingWindowPerChainAndToken.save();

  let newDepositPerChainAndTokenLogs = new Array<string>();
  newDepositPerChainAndTokenLogs.push(deposit.id);

  let oldDepositsPerChainAndTokenLogs = slidingWindowPerChainAndToken.deposits;

  for (let i = 0; i < oldDepositsPerChainAndTokenLogs.length; i++) {
    let oldDepositPerChainAndToken = DepositEntity.load(
      oldDepositsPerChainAndTokenLogs[i]
    );
    if (!oldDepositPerChainAndToken) continue;
    if (
      deposit.timestamp.minus(oldDepositPerChainAndToken.timestamp) >
      BigInt.fromI32(86400)
    ) {
      slidingWindowPerChainAndToken.cumulativeRewardAmount = slidingWindowPerChainAndToken.cumulativeRewardAmount.minus(
        oldDepositPerChainAndToken.rewardAmount
      );
      slidingWindowPerChainAndToken.cumulativeAmount = slidingWindowPerChainAndToken.cumulativeAmount.minus(
        oldDepositPerChainAndToken.amount
      );
      slidingWindowPerChainAndToken.count -= BigInt.fromI32(1);
    } else {
      newDepositPerChainAndTokenLogs.push(oldDepositPerChainAndToken.id);
    }
  }
  slidingWindowPerChainAndToken.deposits = newDepositPerChainAndTokenLogs;
  slidingWindowPerChainAndToken.firstDeposit = newDepositPerChainAndTokenLogs[newDepositPerChainAndTokenLogs.length - 1];

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

  let todayDepositVolumePerChainAndToken = DailyDepositVolumePerChainAndToken.load(
    `${dayEpoch.toString()} - ${deposit.toChainID.toString()} - ${deposit.tokenAddress.toHexString()}`
  );
  if (!todayDepositVolumePerChainAndToken) {
    todayDepositVolumePerChainAndToken = new DailyDepositVolumePerChainAndToken(
      `${dayEpoch.toString()} - ${deposit.toChainID.toString()} - ${deposit.tokenAddress.toHexString()}`
    );
    todayDepositVolumePerChainAndToken.cumulativeAmount = BigInt.fromI32(0);
    todayDepositVolumePerChainAndToken.cumulativeRewardAmount = BigInt.fromI32(
      0
    );
    todayDepositVolumePerChainAndToken.toChainID = deposit.toChainID;
    todayDepositVolumePerChainAndToken.tokenAddress = deposit.tokenAddress;
    todayDepositVolumePerChainAndToken.count = BigInt.fromI32(0);
    todayDepositVolumePerChainAndToken.timestamp = dayEpoch;
  }

  todayDepositVolumePerChainAndToken.cumulativeRewardAmount +=
    deposit.rewardAmount;
  todayDepositVolumePerChainAndToken.cumulativeAmount += deposit.amount;
  todayDepositVolumePerChainAndToken.count += BigInt.fromI32(1);

  log.info("Today deposit epoch {}", [todayDepositVolume.id]);

  todayDepositVolume.cumulativeRewardAmount += deposit.rewardAmount;
  todayDepositVolume.cumulativeAmount += deposit.amount;
  todayDepositVolume.count += BigInt.fromI32(1);

  deposit.save();
  todayDepositVolume.save();
  todayDepositVolumePerChainAndToken.save();

  let hourlyDepositVolumePerChainAndToken = HourlyDepositVolumePerChainAndToken.load(`${hourEpoch}-${deposit.tokenAddress.toHex()}-${deposit.toChainID}`);
  if (!hourlyDepositVolumePerChainAndToken) {
    hourlyDepositVolumePerChainAndToken = new HourlyDepositVolumePerChainAndToken(`${hourEpoch}-${deposit.tokenAddress.toHex()}-${deposit.toChainID}`);
    hourlyDepositVolumePerChainAndToken.timestamp = hourEpoch;
    hourlyDepositVolumePerChainAndToken.toChainID = deposit.toChainID;
    hourlyDepositVolumePerChainAndToken.tokenAddress = deposit.tokenAddress;

    hourlyDepositVolumePerChainAndToken.count = BigInt.fromI32(0);
    hourlyDepositVolumePerChainAndToken.cumulativeAmount = BigInt.fromI32(0);
    hourlyDepositVolumePerChainAndToken.cumulativeRewardAmount = BigInt.fromI32(0);
  }

  hourlyDepositVolumePerChainAndToken.count = hourlyDepositVolumePerChainAndToken.count.plus(BigInt.fromI32(1));
  hourlyDepositVolumePerChainAndToken.cumulativeAmount = hourlyDepositVolumePerChainAndToken.cumulativeAmount.plus(deposit.amount);
  hourlyDepositVolumePerChainAndToken.cumulativeRewardAmount = hourlyDepositVolumePerChainAndToken.cumulativeAmount.plus(deposit.rewardAmount);
  hourlyDepositVolumePerChainAndToken.save();

  let uniqueWallet = UniqueWallet.load(event.params.from.toHex());
  log.info("hexString: {}", [event.params.from.toHexString()]);

  if (uniqueWallet == null) {
    let uniqueWalletCount = UniqueWalletCount.load("0");

    if (uniqueWalletCount == null) {
      uniqueWalletCount = new UniqueWalletCount("0");
      uniqueWalletCount.count = BigInt.fromI32(0);
    }

    let uniqueWalletCountPerToken = UniqueWalletCount.load(
      event.params.tokenAddress.toHexString()
    );

    if (uniqueWalletCountPerToken == null) {
      uniqueWalletCountPerToken = new UniqueWalletCount(
        event.params.tokenAddress.toHexString()
      );
      uniqueWalletCountPerToken.count = BigInt.fromI32(0);
    }

    uniqueWallet = new UniqueWallet(event.params.from.toHexString());
    uniqueWallet.count = BigInt.fromI32(0);

    uniqueWalletCount.count = uniqueWalletCount.count.plus(BigInt.fromI32(1));

    uniqueWalletCountPerToken.count = uniqueWalletCountPerToken.count.plus(
      BigInt.fromI32(1)
    );

    uniqueWalletCount.save();
    uniqueWalletCountPerToken.save();
  }

  uniqueWallet.count = uniqueWallet.count.plus(BigInt.fromI32(1));
  uniqueWallet.save();
}

// export function handleEthReceived(event: EthReceived): void { }

export function updateIncentivePoolBalance(
  txId: string,
  tokenAddress: Address,
  timestamp: BigInt,
  eventAddress: Address
): void {
  const liquidityPoolContract = LiquidityPool.bind(eventAddress);
  const currentIncentivePoolBalance = liquidityPoolContract.incentivePool(
    tokenAddress
  );

  const logKey = `${txId} - ${tokenAddress.toHex()}`;
  let incentivePoolBalanceLogEntry = IncentivePoolBalanceLogEntry.load(logKey);
  if (!incentivePoolBalanceLogEntry) {
    incentivePoolBalanceLogEntry = new IncentivePoolBalanceLogEntry(logKey);
    incentivePoolBalanceLogEntry.tokenAddress = tokenAddress;
    incentivePoolBalanceLogEntry.timestamp = timestamp;
    incentivePoolBalanceLogEntry.poolBalance = currentIncentivePoolBalance;
    log.info("Created new incentivePoolBalance Log Entry", []);
  } else {
    incentivePoolBalanceLogEntry.poolBalance = currentIncentivePoolBalance;
    incentivePoolBalanceLogEntry.save();
    return;
  }

  const epochModSecondsInAHour = timestamp.mod(BigInt.fromI32(3600));
  const hourEpoch = timestamp.minus(epochModSecondsInAHour);

  let hourlyIncentivePoolBalance = HourlyIncentivePoolBalance.load(
    `${tokenAddress.toHex()} - ${hourEpoch.toString()}`
  );
  if (!hourlyIncentivePoolBalance) {
    hourlyIncentivePoolBalance = new HourlyIncentivePoolBalance(
      tokenAddress.toHex()
    );
    hourlyIncentivePoolBalance.poolBalance = BigInt.fromI32(0);
    hourlyIncentivePoolBalance.tokenAddress = tokenAddress;
    hourlyIncentivePoolBalance.timestamp = hourEpoch;
    hourlyIncentivePoolBalance.count = BigInt.fromI32(0);
  }

  hourlyIncentivePoolBalance.count = hourlyIncentivePoolBalance.count.plus(
    BigInt.fromI32(1)
  );
  hourlyIncentivePoolBalance.poolBalance = hourlyIncentivePoolBalance.poolBalance
    .times(hourlyIncentivePoolBalance.count)
    .plus(currentIncentivePoolBalance)
    .div(hourlyIncentivePoolBalance.count);
  hourlyIncentivePoolBalance.save();

  let incentivePoolBalanceRollingWindow = RollingIncentivePoolBalanceForLast24Hour.load(
    tokenAddress.toHex()
  );
  if (!incentivePoolBalanceRollingWindow) {
    incentivePoolBalanceRollingWindow = new RollingIncentivePoolBalanceForLast24Hour(
      tokenAddress.toHex()
    );
    incentivePoolBalanceRollingWindow.tokenAddress = tokenAddress;
    incentivePoolBalanceRollingWindow.poolBalance = BigInt.fromI32(0);
    incentivePoolBalanceRollingWindow.count = BigInt.fromI32(0);
    incentivePoolBalanceRollingWindow.logs = new Array<string>();
  }

  incentivePoolBalanceRollingWindow.count = incentivePoolBalanceRollingWindow.count.plus(
    BigInt.fromI32(1)
  );
  incentivePoolBalanceRollingWindow.poolBalance = incentivePoolBalanceRollingWindow.poolBalance
    .times(incentivePoolBalanceRollingWindow.count)
    .plus(currentIncentivePoolBalance)
    .div(incentivePoolBalanceRollingWindow.count);

  let oldIncentivePoolBalanceLogs = incentivePoolBalanceRollingWindow.logs;
  let newIncentivePoolBalanceLogs = new Array<string>();

  newIncentivePoolBalanceLogs.push(incentivePoolBalanceLogEntry.id);

  // sliding window calculation
  for (let i = 0; i < oldIncentivePoolBalanceLogs.length; i++) {
    // for every feeDetailLogEntry in the rolling window, check if they are old enough to remove
    // if so, then remove and also decrease their values from cumulative rolling window values
    let oldIncentivePoolBalanceLog = IncentivePoolBalanceLogEntry.load(
      oldIncentivePoolBalanceLogs[i]
    );
    if (!oldIncentivePoolBalanceLog) continue;
    if (
      timestamp.minus(oldIncentivePoolBalanceLog.timestamp) >
      BigInt.fromI32(3600)
    ) {
      incentivePoolBalanceRollingWindow.count = incentivePoolBalanceRollingWindow.count.minus(
        BigInt.fromI32(1)
      );
      incentivePoolBalanceRollingWindow.poolBalance = incentivePoolBalanceRollingWindow.poolBalance
        .times(incentivePoolBalanceRollingWindow.count)
        .minus(oldIncentivePoolBalanceLog.poolBalance)
        .div(incentivePoolBalanceRollingWindow.count);
    } else {
      newIncentivePoolBalanceLogs.push(oldIncentivePoolBalanceLog.id);
    }
  }
  incentivePoolBalanceRollingWindow.logs = newIncentivePoolBalanceLogs;
  incentivePoolBalanceRollingWindow.save();
  incentivePoolBalanceLogEntry.save();
}


export function handleDepositAndSwap(event: DepositAndSwap): void {

const depositAndSwap = new DepositAndSwapEntity(event.transaction.hash.toHex());
  depositAndSwap.sender = event.params.from;
  depositAndSwap.tokenAddress = event.params.tokenAddress;
  depositAndSwap.receiver = event.params.receiver;
  depositAndSwap.toChainID = event.params.toChainId;
  depositAndSwap.rewardAmount = event.params.reward;
  depositAndSwap.amount = event.params.amount;
  depositAndSwap.rewardAmountPercent = depositAndSwap.rewardAmount.divDecimal(depositAndSwap.amount.toBigDecimal()).times(BigInt.fromI32(100).toBigDecimal());
  depositAndSwap.tag = event.params.tag;
  depositAndSwap.timestamp = event.block.timestamp;
  // depositAndSwap.swapRequests = [];

  // for (let i = 0; i < event.params.swapRequests.length; i++) {
  // const swapRequest = new SwapRequest(event.transaction.hash.toHex());
  // swapRequest.percentage = event.params.swapRequests[i].percentage.toBigDecimal();
  // swapRequest.tokenAddress  = event.params.swapRequests[i].tokenAddress;
  // swapRequest.amount = event.params.swapRequests[i].amount;
  // swapRequest.path = event.params.swapRequests[i].path;


  //   depositAndSwap.swapRequests.push(swapRequest.percentage.toString());
  //   depositAndSwap.swapRequests.push(swapRequest.tokenAddress.toString());
  //   depositAndSwap.swapRequests.push(swapRequest.amount.toString());
  //   depositAndSwap.swapRequests.push(swapRequest.path.toString());

  // }

  depositAndSwap.save()

}
