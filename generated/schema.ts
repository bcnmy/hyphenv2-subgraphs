// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class FeeDetailLogEntry extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("lpFee", Value.fromBigInt(BigInt.zero()));
    this.set("transferFee", Value.fromBigInt(BigInt.zero()));
    this.set("gasFee", Value.fromBigInt(BigInt.zero()));
    this.set("timestamp", Value.fromBigInt(BigInt.zero()));
    this.set("dailyWindow", Value.fromString(""));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save FeeDetailLogEntry entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save FeeDetailLogEntry entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("FeeDetailLogEntry", id.toString(), this);
    }
  }

  static load(id: string): FeeDetailLogEntry | null {
    return changetype<FeeDetailLogEntry | null>(
      store.get("FeeDetailLogEntry", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get lpFee(): BigInt {
    let value = this.get("lpFee");
    return value!.toBigInt();
  }

  set lpFee(value: BigInt) {
    this.set("lpFee", Value.fromBigInt(value));
  }

  get transferFee(): BigInt {
    let value = this.get("transferFee");
    return value!.toBigInt();
  }

  set transferFee(value: BigInt) {
    this.set("transferFee", Value.fromBigInt(value));
  }

  get gasFee(): BigInt {
    let value = this.get("gasFee");
    return value!.toBigInt();
  }

  set gasFee(value: BigInt) {
    this.set("gasFee", Value.fromBigInt(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value!.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }

  get rollingWindow(): string | null {
    let value = this.get("rollingWindow");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set rollingWindow(value: string | null) {
    if (!value) {
      this.unset("rollingWindow");
    } else {
      this.set("rollingWindow", Value.fromString(<string>value));
    }
  }

  get dailyWindow(): string {
    let value = this.get("dailyWindow");
    return value!.toString();
  }

  set dailyWindow(value: string) {
    this.set("dailyWindow", Value.fromString(value));
  }
}

export class FeeCumulative extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("lpFee", Value.fromBigInt(BigInt.zero()));
    this.set("transferFee", Value.fromBigInt(BigInt.zero()));
    this.set("gasFee", Value.fromBigInt(BigInt.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save FeeCumulative entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save FeeCumulative entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("FeeCumulative", id.toString(), this);
    }
  }

  static load(id: string): FeeCumulative | null {
    return changetype<FeeCumulative | null>(store.get("FeeCumulative", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get lpFee(): BigInt {
    let value = this.get("lpFee");
    return value!.toBigInt();
  }

  set lpFee(value: BigInt) {
    this.set("lpFee", Value.fromBigInt(value));
  }

  get transferFee(): BigInt {
    let value = this.get("transferFee");
    return value!.toBigInt();
  }

  set transferFee(value: BigInt) {
    this.set("transferFee", Value.fromBigInt(value));
  }

  get gasFee(): BigInt {
    let value = this.get("gasFee");
    return value!.toBigInt();
  }

  set gasFee(value: BigInt) {
    this.set("gasFee", Value.fromBigInt(value));
  }
}

export class RollingFeeDetailsLogsForLast24Hour extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("cumulativeLpFee", Value.fromBigInt(BigInt.zero()));
    this.set("cumulativeTransferFee", Value.fromBigInt(BigInt.zero()));
    this.set("cumulativeGasFee", Value.fromBigInt(BigInt.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(
      id != null,
      "Cannot save RollingFeeDetailsLogsForLast24Hour entity without an ID"
    );
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save RollingFeeDetailsLogsForLast24Hour entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("RollingFeeDetailsLogsForLast24Hour", id.toString(), this);
    }
  }

  static load(id: string): RollingFeeDetailsLogsForLast24Hour | null {
    return changetype<RollingFeeDetailsLogsForLast24Hour | null>(
      store.get("RollingFeeDetailsLogsForLast24Hour", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get cumulativeLpFee(): BigInt {
    let value = this.get("cumulativeLpFee");
    return value!.toBigInt();
  }

  set cumulativeLpFee(value: BigInt) {
    this.set("cumulativeLpFee", Value.fromBigInt(value));
  }

  get cumulativeTransferFee(): BigInt {
    let value = this.get("cumulativeTransferFee");
    return value!.toBigInt();
  }

  set cumulativeTransferFee(value: BigInt) {
    this.set("cumulativeTransferFee", Value.fromBigInt(value));
  }

  get cumulativeGasFee(): BigInt {
    let value = this.get("cumulativeGasFee");
    return value!.toBigInt();
  }

  set cumulativeGasFee(value: BigInt) {
    this.set("cumulativeGasFee", Value.fromBigInt(value));
  }

  get logs(): Array<string> | null {
    let value = this.get("logs");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set logs(value: Array<string> | null) {
    if (!value) {
      this.unset("logs");
    } else {
      this.set("logs", Value.fromStringArray(<Array<string>>value));
    }
  }
}

export class DailyFeeDetailsLog extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("cumulativeLpFee", Value.fromBigInt(BigInt.zero()));
    this.set("cumulativeTransferFee", Value.fromBigInt(BigInt.zero()));
    this.set("cumulativeGasFee", Value.fromBigInt(BigInt.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save DailyFeeDetailsLog entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save DailyFeeDetailsLog entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("DailyFeeDetailsLog", id.toString(), this);
    }
  }

  static load(id: string): DailyFeeDetailsLog | null {
    return changetype<DailyFeeDetailsLog | null>(
      store.get("DailyFeeDetailsLog", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get cumulativeLpFee(): BigInt {
    let value = this.get("cumulativeLpFee");
    return value!.toBigInt();
  }

  set cumulativeLpFee(value: BigInt) {
    this.set("cumulativeLpFee", Value.fromBigInt(value));
  }

  get cumulativeTransferFee(): BigInt {
    let value = this.get("cumulativeTransferFee");
    return value!.toBigInt();
  }

  set cumulativeTransferFee(value: BigInt) {
    this.set("cumulativeTransferFee", Value.fromBigInt(value));
  }

  get cumulativeGasFee(): BigInt {
    let value = this.get("cumulativeGasFee");
    return value!.toBigInt();
  }

  set cumulativeGasFee(value: BigInt) {
    this.set("cumulativeGasFee", Value.fromBigInt(value));
  }

  get logs(): Array<string> | null {
    let value = this.get("logs");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set logs(value: Array<string> | null) {
    if (!value) {
      this.unset("logs");
    } else {
      this.set("logs", Value.fromStringArray(<Array<string>>value));
    }
  }
}

export class Deposit extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("sender", Value.fromBytes(Bytes.empty()));
    this.set("tokenAddress", Value.fromBytes(Bytes.empty()));
    this.set("timestamp", Value.fromBigInt(BigInt.zero()));
    this.set("receiver", Value.fromBytes(Bytes.empty()));
    this.set("toChainID", Value.fromBigInt(BigInt.zero()));
    this.set("rewardAmount", Value.fromBigInt(BigInt.zero()));
    this.set("amount", Value.fromBigInt(BigInt.zero()));
    this.set("tag", Value.fromString(""));
    this.set("dailyWindow", Value.fromString(""));
    this.set("dailyWindowPerChainAndToken", Value.fromString(""));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Deposit entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save Deposit entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("Deposit", id.toString(), this);
    }
  }

  static load(id: string): Deposit | null {
    return changetype<Deposit | null>(store.get("Deposit", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get sender(): Bytes {
    let value = this.get("sender");
    return value!.toBytes();
  }

  set sender(value: Bytes) {
    this.set("sender", Value.fromBytes(value));
  }

  get tokenAddress(): Bytes {
    let value = this.get("tokenAddress");
    return value!.toBytes();
  }

  set tokenAddress(value: Bytes) {
    this.set("tokenAddress", Value.fromBytes(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value!.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }

  get receiver(): Bytes {
    let value = this.get("receiver");
    return value!.toBytes();
  }

  set receiver(value: Bytes) {
    this.set("receiver", Value.fromBytes(value));
  }

  get toChainID(): BigInt {
    let value = this.get("toChainID");
    return value!.toBigInt();
  }

  set toChainID(value: BigInt) {
    this.set("toChainID", Value.fromBigInt(value));
  }

  get rewardAmount(): BigInt {
    let value = this.get("rewardAmount");
    return value!.toBigInt();
  }

  set rewardAmount(value: BigInt) {
    this.set("rewardAmount", Value.fromBigInt(value));
  }

  get amount(): BigInt {
    let value = this.get("amount");
    return value!.toBigInt();
  }

  set amount(value: BigInt) {
    this.set("amount", Value.fromBigInt(value));
  }

  get tag(): string {
    let value = this.get("tag");
    return value!.toString();
  }

  set tag(value: string) {
    this.set("tag", Value.fromString(value));
  }

  get rollingWindow(): string | null {
    let value = this.get("rollingWindow");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set rollingWindow(value: string | null) {
    if (!value) {
      this.unset("rollingWindow");
    } else {
      this.set("rollingWindow", Value.fromString(<string>value));
    }
  }

  get rollingWindowPerChainAndToken(): string | null {
    let value = this.get("rollingWindowPerChainAndToken");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set rollingWindowPerChainAndToken(value: string | null) {
    if (!value) {
      this.unset("rollingWindowPerChainAndToken");
    } else {
      this.set(
        "rollingWindowPerChainAndToken",
        Value.fromString(<string>value)
      );
    }
  }

  get dailyWindow(): string {
    let value = this.get("dailyWindow");
    return value!.toString();
  }

  set dailyWindow(value: string) {
    this.set("dailyWindow", Value.fromString(value));
  }

  get dailyWindowPerChainAndToken(): string {
    let value = this.get("dailyWindowPerChainAndToken");
    return value!.toString();
  }

  set dailyWindowPerChainAndToken(value: string) {
    this.set("dailyWindowPerChainAndToken", Value.fromString(value));
  }
}

export class DepositVolumeCumulative extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("cumulativeRewardAmount", Value.fromBigInt(BigInt.zero()));
    this.set("cumulativeAmount", Value.fromBigInt(BigInt.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(
      id != null,
      "Cannot save DepositVolumeCumulative entity without an ID"
    );
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save DepositVolumeCumulative entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("DepositVolumeCumulative", id.toString(), this);
    }
  }

  static load(id: string): DepositVolumeCumulative | null {
    return changetype<DepositVolumeCumulative | null>(
      store.get("DepositVolumeCumulative", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get cumulativeRewardAmount(): BigInt {
    let value = this.get("cumulativeRewardAmount");
    return value!.toBigInt();
  }

  set cumulativeRewardAmount(value: BigInt) {
    this.set("cumulativeRewardAmount", Value.fromBigInt(value));
  }

  get cumulativeAmount(): BigInt {
    let value = this.get("cumulativeAmount");
    return value!.toBigInt();
  }

  set cumulativeAmount(value: BigInt) {
    this.set("cumulativeAmount", Value.fromBigInt(value));
  }
}

export class DepositVolumeCumulativePerChainAndToken extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("cumulativeRewardAmount", Value.fromBigInt(BigInt.zero()));
    this.set("cumulativeAmount", Value.fromBigInt(BigInt.zero()));
    this.set("toChainID", Value.fromBigInt(BigInt.zero()));
    this.set("tokenAddress", Value.fromBytes(Bytes.empty()));
  }

  save(): void {
    let id = this.get("id");
    assert(
      id != null,
      "Cannot save DepositVolumeCumulativePerChainAndToken entity without an ID"
    );
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save DepositVolumeCumulativePerChainAndToken entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("DepositVolumeCumulativePerChainAndToken", id.toString(), this);
    }
  }

  static load(id: string): DepositVolumeCumulativePerChainAndToken | null {
    return changetype<DepositVolumeCumulativePerChainAndToken | null>(
      store.get("DepositVolumeCumulativePerChainAndToken", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get cumulativeRewardAmount(): BigInt {
    let value = this.get("cumulativeRewardAmount");
    return value!.toBigInt();
  }

  set cumulativeRewardAmount(value: BigInt) {
    this.set("cumulativeRewardAmount", Value.fromBigInt(value));
  }

  get cumulativeAmount(): BigInt {
    let value = this.get("cumulativeAmount");
    return value!.toBigInt();
  }

  set cumulativeAmount(value: BigInt) {
    this.set("cumulativeAmount", Value.fromBigInt(value));
  }

  get toChainID(): BigInt {
    let value = this.get("toChainID");
    return value!.toBigInt();
  }

  set toChainID(value: BigInt) {
    this.set("toChainID", Value.fromBigInt(value));
  }

  get tokenAddress(): Bytes {
    let value = this.get("tokenAddress");
    return value!.toBytes();
  }

  set tokenAddress(value: Bytes) {
    this.set("tokenAddress", Value.fromBytes(value));
  }
}

export class RollingDepositVolumeForLast24Hour extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("cumulativeRewardAmount", Value.fromBigInt(BigInt.zero()));
    this.set("cumulativeAmount", Value.fromBigInt(BigInt.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(
      id != null,
      "Cannot save RollingDepositVolumeForLast24Hour entity without an ID"
    );
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save RollingDepositVolumeForLast24Hour entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("RollingDepositVolumeForLast24Hour", id.toString(), this);
    }
  }

  static load(id: string): RollingDepositVolumeForLast24Hour | null {
    return changetype<RollingDepositVolumeForLast24Hour | null>(
      store.get("RollingDepositVolumeForLast24Hour", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get cumulativeRewardAmount(): BigInt {
    let value = this.get("cumulativeRewardAmount");
    return value!.toBigInt();
  }

  set cumulativeRewardAmount(value: BigInt) {
    this.set("cumulativeRewardAmount", Value.fromBigInt(value));
  }

  get cumulativeAmount(): BigInt {
    let value = this.get("cumulativeAmount");
    return value!.toBigInt();
  }

  set cumulativeAmount(value: BigInt) {
    this.set("cumulativeAmount", Value.fromBigInt(value));
  }

  get deposits(): Array<string> | null {
    let value = this.get("deposits");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set deposits(value: Array<string> | null) {
    if (!value) {
      this.unset("deposits");
    } else {
      this.set("deposits", Value.fromStringArray(<Array<string>>value));
    }
  }
}

export class RollingDepositVolumeForLast24HourPerChainAndToken extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("cumulativeRewardAmount", Value.fromBigInt(BigInt.zero()));
    this.set("cumulativeAmount", Value.fromBigInt(BigInt.zero()));
    this.set("tokenAddress", Value.fromBytes(Bytes.empty()));
    this.set("toChainID", Value.fromBigInt(BigInt.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(
      id != null,
      "Cannot save RollingDepositVolumeForLast24HourPerChainAndToken entity without an ID"
    );
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save RollingDepositVolumeForLast24HourPerChainAndToken entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set(
        "RollingDepositVolumeForLast24HourPerChainAndToken",
        id.toString(),
        this
      );
    }
  }

  static load(
    id: string
  ): RollingDepositVolumeForLast24HourPerChainAndToken | null {
    return changetype<RollingDepositVolumeForLast24HourPerChainAndToken | null>(
      store.get("RollingDepositVolumeForLast24HourPerChainAndToken", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get cumulativeRewardAmount(): BigInt {
    let value = this.get("cumulativeRewardAmount");
    return value!.toBigInt();
  }

  set cumulativeRewardAmount(value: BigInt) {
    this.set("cumulativeRewardAmount", Value.fromBigInt(value));
  }

  get cumulativeAmount(): BigInt {
    let value = this.get("cumulativeAmount");
    return value!.toBigInt();
  }

  set cumulativeAmount(value: BigInt) {
    this.set("cumulativeAmount", Value.fromBigInt(value));
  }

  get deposits(): Array<string> | null {
    let value = this.get("deposits");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set deposits(value: Array<string> | null) {
    if (!value) {
      this.unset("deposits");
    } else {
      this.set("deposits", Value.fromStringArray(<Array<string>>value));
    }
  }

  get tokenAddress(): Bytes {
    let value = this.get("tokenAddress");
    return value!.toBytes();
  }

  set tokenAddress(value: Bytes) {
    this.set("tokenAddress", Value.fromBytes(value));
  }

  get toChainID(): BigInt {
    let value = this.get("toChainID");
    return value!.toBigInt();
  }

  set toChainID(value: BigInt) {
    this.set("toChainID", Value.fromBigInt(value));
  }
}

export class DailyDepositVolume extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("cumulativeRewardAmount", Value.fromBigInt(BigInt.zero()));
    this.set("cumulativeAmount", Value.fromBigInt(BigInt.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save DailyDepositVolume entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save DailyDepositVolume entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("DailyDepositVolume", id.toString(), this);
    }
  }

  static load(id: string): DailyDepositVolume | null {
    return changetype<DailyDepositVolume | null>(
      store.get("DailyDepositVolume", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get cumulativeRewardAmount(): BigInt {
    let value = this.get("cumulativeRewardAmount");
    return value!.toBigInt();
  }

  set cumulativeRewardAmount(value: BigInt) {
    this.set("cumulativeRewardAmount", Value.fromBigInt(value));
  }

  get cumulativeAmount(): BigInt {
    let value = this.get("cumulativeAmount");
    return value!.toBigInt();
  }

  set cumulativeAmount(value: BigInt) {
    this.set("cumulativeAmount", Value.fromBigInt(value));
  }

  get deposits(): Array<string> {
    let value = this.get("deposits");
    return value!.toStringArray();
  }

  set deposits(value: Array<string>) {
    this.set("deposits", Value.fromStringArray(value));
  }
}

export class DailyDepositVolumePerChainAndToken extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("cumulativeRewardAmount", Value.fromBigInt(BigInt.zero()));
    this.set("cumulativeAmount", Value.fromBigInt(BigInt.zero()));
    this.set("toChainID", Value.fromBigInt(BigInt.zero()));
    this.set("tokenAddress", Value.fromBytes(Bytes.empty()));
  }

  save(): void {
    let id = this.get("id");
    assert(
      id != null,
      "Cannot save DailyDepositVolumePerChainAndToken entity without an ID"
    );
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save DailyDepositVolumePerChainAndToken entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("DailyDepositVolumePerChainAndToken", id.toString(), this);
    }
  }

  static load(id: string): DailyDepositVolumePerChainAndToken | null {
    return changetype<DailyDepositVolumePerChainAndToken | null>(
      store.get("DailyDepositVolumePerChainAndToken", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get cumulativeRewardAmount(): BigInt {
    let value = this.get("cumulativeRewardAmount");
    return value!.toBigInt();
  }

  set cumulativeRewardAmount(value: BigInt) {
    this.set("cumulativeRewardAmount", Value.fromBigInt(value));
  }

  get cumulativeAmount(): BigInt {
    let value = this.get("cumulativeAmount");
    return value!.toBigInt();
  }

  set cumulativeAmount(value: BigInt) {
    this.set("cumulativeAmount", Value.fromBigInt(value));
  }

  get deposits(): Array<string> {
    let value = this.get("deposits");
    return value!.toStringArray();
  }

  set deposits(value: Array<string>) {
    this.set("deposits", Value.fromStringArray(value));
  }

  get toChainID(): BigInt {
    let value = this.get("toChainID");
    return value!.toBigInt();
  }

  set toChainID(value: BigInt) {
    this.set("toChainID", Value.fromBigInt(value));
  }

  get tokenAddress(): Bytes {
    let value = this.get("tokenAddress");
    return value!.toBytes();
  }

  set tokenAddress(value: Bytes) {
    this.set("tokenAddress", Value.fromBytes(value));
  }
}

export class UniqueWallet extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("count", Value.fromBigInt(BigInt.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save UniqueWallet entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save UniqueWallet entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("UniqueWallet", id.toString(), this);
    }
  }

  static load(id: string): UniqueWallet | null {
    return changetype<UniqueWallet | null>(store.get("UniqueWallet", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get count(): BigInt {
    let value = this.get("count");
    return value!.toBigInt();
  }

  set count(value: BigInt) {
    this.set("count", Value.fromBigInt(value));
  }
}

export class UniqueWalletCount extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("count", Value.fromBigInt(BigInt.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save UniqueWalletCount entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save UniqueWalletCount entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("UniqueWalletCount", id.toString(), this);
    }
  }

  static load(id: string): UniqueWalletCount | null {
    return changetype<UniqueWalletCount | null>(
      store.get("UniqueWalletCount", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get count(): BigInt {
    let value = this.get("count");
    return value!.toBigInt();
  }

  set count(value: BigInt) {
    this.set("count", Value.fromBigInt(value));
  }
}
