import moment from "moment";
import { ChartDateFormats } from "../components/HistoryGraph/Chart";
export const getDateRange = ({
  data,
  from,
  minVisible,
  to,
  range,
}: {
  data: string[];
  from: string;
  minVisible: number;
  to?: string;
  range?: number;
}) => {
  
  const [dataRangeFrom, dataRangeTo] = [
    moment(data[0]).toDate(),
    moment(data[data.length - 1]).toDate(),
  ];
  const _from: Date = moment(from).toDate();
  const _to = to
    ? moment(to).toDate()
    : moment(from).add(range, "days").toDate();
  const _range = range ? range : moment(_to).diff(moment(_from), "days");

  let left: Date, right: Date;
  const isCurrentInsideRange =
    moment(_from).isSameOrAfter(dataRangeFrom) &&
    moment(_from).isSameOrBefore(dataRangeTo);

  const isChangeInsideRange =
    moment(_to).isSameOrAfter(dataRangeFrom) &&
    moment(_to).isSameOrBefore(dataRangeTo);

  
  if (isCurrentInsideRange || isChangeInsideRange) {
    if (isChangeInsideRange) {
      if (moment(_to).isSameOrAfter(_from)) {
        left = _from;
        right = _to;
      } else {
        left = _to;
        right = _from;
      }
    } else {
      if (moment(_to).isSameOrAfter(_from)) {
        left = _from;
        right = dataRangeTo;
      } else {
        left = dataRangeFrom;
        right = _from;
      }
    }
  } else {
    if (_range >= 0) {
      left = moment(dataRangeTo).subtract(minVisible, "days").toDate();
      right = dataRangeTo;
    } else {
      left = dataRangeFrom;
      right = moment(dataRangeFrom).add(minVisible, "days").toDate();
    }
  }

  const diff = Math.abs(moment(right).diff(left, "days"));

  if (diff >= minVisible) {
    return {
      from: moment(left).format(ChartDateFormats.INNER),
      to: moment(right).format(ChartDateFormats.INNER),
      range: diff,
      data: data.filter(
        (d, index) =>
          moment(d).isSameOrAfter(left) && moment(d).isSameOrBefore(right)
      ),
    };
  } else {
    if (moment(left).isSame(dataRangeFrom)) {
      const isMinVisRangeIsInsideOfData = moment(left)
        .add(minVisible, "days")
        .isBefore(dataRangeTo);
      const extendedTo = isMinVisRangeIsInsideOfData
        ? moment(left).add(minVisible, "days").toDate()
        : moment(dataRangeTo).toDate();

      return {
        from: moment(left).format(ChartDateFormats.INNER),
        to: moment(extendedTo).format(ChartDateFormats.INNER),
        range: isMinVisRangeIsInsideOfData
          ? minVisible
          : moment(left).diff(moment(extendedTo), "days"),
        data: data.filter(
          (d, index) =>
            moment(d).isSameOrAfter(left) &&
            moment(d).isSameOrBefore(extendedTo)
        ),
      };
    } else if (moment(right).isSame(dataRangeTo)) {
      const isMinVisRangeIsInsideOfData = moment(right)
        .subtract(minVisible, "days")
        .isAfter(dataRangeFrom);
      const extendedFrom = isMinVisRangeIsInsideOfData
        ? moment(right).subtract(minVisible, "days").toDate()
        : moment(dataRangeFrom).toDate();

      return {
        from: moment(extendedFrom).format(ChartDateFormats.INNER),
        to: moment(right).format(ChartDateFormats.INNER),
        range: isMinVisRangeIsInsideOfData
          ? minVisible
          : moment(right).diff(moment(extendedFrom), "days"),
        data: data.filter(
          (d, index) =>
            moment(d).isSameOrBefore(right) &&
            moment(d).isSameOrAfter(extendedFrom)
        ),
      };
    } else {
      return {
        from: moment(left).format(ChartDateFormats.INNER),
        to: moment(left).add(minVisible, "days").format(ChartDateFormats.INNER),
        range: minVisible,
        data: data.filter(
          (d, index) =>
            moment(d).isSameOrAfter(left) &&
            moment(d).isSameOrBefore(moment(left).add(minVisible, "days"))
        ),
      };
    }
  }
};

export const getRangeFromData = (
  from: string,
  to: string,
  data: string[],
  minVisible: number
) => {};
