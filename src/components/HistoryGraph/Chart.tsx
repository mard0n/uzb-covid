import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import "chartjs-plugin-zoom/dist/chartjs-plugin-zoom";
import ChartJs from "chart.js";
import { getZoneStatusProps } from "../../utils/getZoneStatusProps";
import { getDateRange } from "../../utils/getDateRange";

export enum ChartDateFormats {
  INNER = "YYYY-MM-DD",
  DISPLAY = "DD MMM YYYY",
  DISPLAY_NO_YEAR = "DD MMM",
  MONTH = "MMM",
}

export interface ChartProps {
  data: {
    date: string;
    infectedNumber: number;
    recoveredNumber: number;
    deadNumber: number;
  }[];
}

const Chart: React.FC<ChartProps> = ({ data }) => {
  const minVisible = 7;
  const sortedArray = data.sort(
    (a: any, b: any) =>
      (moment(a.date).format("YYYYMMDD") as any) -
      (moment(b.date).format("YYYYMMDD") as any)
  );
  let date_list = sortedArray.map((d) =>
    moment(d.date).format(ChartDateFormats.INNER)
  );
  const [isGrabbed, setIsGrabbed] = useState(false);
  const [currentVisibleTicks, setCurrentVisibleTicks] = useState({
    from: date_list[date_list.length - 1],
    range: -minVisible,
  });
  const canvas = useRef<any>();
  const chart = useRef<Chart>();

  useEffect(() => {
    const dataFromRange = getDateRange({
      data: date_list,
      minVisible: minVisible,
      from: currentVisibleTicks.from,
      range: -Math.abs(currentVisibleTicks.range),
    });
    chart.current = new ChartJs(canvas.current, {
      type: "line",
      data: {
        labels: date_list,
        // labels: [...data.map((h) => new Date(h.date))],
        datasets: [
          {
            label: "Kasallangan",
            borderColor: getZoneStatusProps("RISKY").textInBlueishBg,
            backgroundColor: getZoneStatusProps("RISKY").textInBlueishBg,
            data: [...data.map((h) => h?.infectedNumber)],
          },
          {
            label: "Sog'aygan",
            borderColor: getZoneStatusProps("SAFE").textInBlueishBg,
            backgroundColor: getZoneStatusProps("SAFE").textInBlueishBg,
            data: [...data.map((h) => h.recoveredNumber)],
          },
          {
            label: "Vafot etgan",
            borderColor: getZoneStatusProps("DANGEROUS").textInBlueishBg,
            backgroundColor: getZoneStatusProps("DANGEROUS").textInBlueishBg,
            data: [...data.map((h) => h.deadNumber)],
          },
        ],
      },
      options: {
        elements: {
          line: {
            fill: false,
          },
        },
        legend: {
          display: false,
        },
        tooltips: {
          mode: "index",
          intersect: false,
          // callbacks: {
          //   title: (item: any, data: any) => {
          //     return moment(item[0].label).format(ChartDateFormats.DISPLAY);
          //   },
          // },
          // backgroundColor: "white",
          // titleFontSize: 14,
          // titleFontColor: "#242B43",
          // // titleFontStyle: 'inherit 600',
          // bodyFontColor: "#242B43",
          // bodyFontSize: 12,
          // // bodyFontStyle: 'inherit',
          // displayColors: false,
          enabled: false,
          custom: function (tooltipModel) {
            // Tooltip Element
            var tooltipEl: any = document.getElementById("chartjs-tooltip");

            // Create element on first render
            if (!tooltipEl) {
              tooltipEl = document.createElement("div");
              tooltipEl.id = "chartjs-tooltip";
              tooltipEl.innerHTML = "<table></table>";
              document.body.appendChild(tooltipEl);
            }

            // Hide if no tooltip
            if (tooltipModel.opacity === 0) {
              tooltipEl.style.opacity = 0;
              return;
            }

            // Set caret Position
            tooltipEl.classList.remove("above", "below", "no-transform");
            if (tooltipModel.yAlign) {
              tooltipEl.classList.add(tooltipModel.yAlign);
            } else {
              tooltipEl.classList.add("no-transform");
            }

            function getBody(bodyItem: any) {
              return bodyItem.lines;
            }

            // Set Text
            if (tooltipModel.body) {
              var titleLines = tooltipModel.title || [];
              var bodyLines = tooltipModel.body.map(getBody);

              var innerHtml = "<thead>";

              titleLines.forEach(function (title) {
                let style = "color: #2C3D97; ";
                // style += 'font-family: Rubik; '
                style += "font-weight: 500; ";
                style += "font-size: 14px; ";
                style += "line-height: 16px; ";
                style += "text-align: left; ";

                innerHtml +=
                  '<tr><th style="' +
                  style +
                  '">' +
                  moment(title).format(ChartDateFormats.DISPLAY) +
                  "</th></tr>";
              });
              innerHtml += "</thead><tbody>";

              bodyLines.forEach(function (body, i) {
                // var colors: any = tooltipModel.labelColors[i];
                // var style = 'background:' + colors.backgroundColor;
                // style += '; border-color:' + colors.borderColor;
                // style += '; border-width: 2px';
                // var span = '<span style="' + style + '"></span>';
                let style =
                  "color: " +
                  (tooltipModel.labelColors[i] as any).backgroundColor +
                  "; ";
                style += "font-weight: 400; ";
                style += "font-size: 14px; ";
                style += "line-height: 16px; ";
                style += "text-align: left; ";
                innerHtml +=
                  '<tr><td style="' + style + '">' + body + "</td></tr>";
              });
              innerHtml += "</tbody>";

              var tableRoot = tooltipEl.querySelector("table");
              tableRoot.innerHTML = innerHtml;
            }

            // `this` will be the overall tooltip
            var position: any = canvas.current.getBoundingClientRect();
            // Display, position, and set styles for font
            tooltipEl.style.opacity = 1;
            tooltipEl.style.zIndex = 10000;
            tooltipEl.style.transform = "translate(10px, -100%)";
            tooltipEl.style.padding = "8px 10px";
            tooltipEl.style.position = "absolute";
            tooltipEl.style.backgroundColor = "white";
            tooltipEl.style.borderRadius = "6px";
            tooltipEl.style.left =
              position.left + window.pageXOffset + tooltipModel.caretX + "px";
            tooltipEl.style.top =
              position.top + window.pageYOffset + tooltipModel.caretY + "px";
            tooltipEl.style.fontFamily = "Rubik";
            // tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
            tooltipEl.style.fontSize = tooltipModel.bodyFontSize + "px";
            tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
            // tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
            tooltipEl.style.pointerEvents = "none";
          },
        },
        scales: {
          xAxes: [
            {
              position: "top",
              type: "time",
              time: {
                // parser: "DD MMM",
                // tooltipFormat: "DD MMM",
                unit: "day",
                minUnit: "day",
                displayFormats: {
                  day: "DD",
                },
              },
              ticks: {
                padding: 24,
                min: dataFromRange.from,
                max: dataFromRange.to,
                fontColor: "#2C3D97",
                fontFamily: "Rubik",
                fontSize: 16,
                fontStyle: "bold",
                // callback: (value: number | string, index: number, values: any) => {
                //   const date = values.find((v: any, i: number) => i === index)?.value
                //   const day = moment(date).format('DD')
                //   const weekDay = moment(date).format('ddd')
                //   return day
                // }
              },
              gridLines: {
                drawBorder: false,
              },
            },
          ],
          yAxes: [
            {
              position: "right",
              gridLines: {
                display: false,
                drawBorder: false,
              },
              ticks: {
                beginAtZero: true,
                padding: 16,
                maxTicksLimit: 6,
                fontFamily: "Rubik",
                fontStyle: "normal",
                fontSize: 12,
                fontColor: "rgba(123, 129, 163, 0.5)",
              },
            },
          ],
        },
        plugins: {
          zoom: {
            // Container for pan options
            pan: {
              // Boolean to enable panning
              enabled: true,

              // Panning directions. Remove the appropriate direction to disable
              // Eg. 'y' would only allow panning in the y direction
              // A function that is called as the user is panning and returns the
              // available directions can also be used:
              //   mode: function({ chart }) {
              //     return 'xy';
              //   },
              mode: "x",

              rangeMin: {
                //   // Format of min pan range depends on scale type
                x: new Date(date_list[0]).setHours(
                  new Date(date_list[0]).getHours() - 4
                  // new Date(date_list[0]).getHours() - 4
                ),
                //   y: null,
              },
              rangeMax: {
                //   // Format of max pan range depends on scale type
                x: new Date(date_list[date_list.length - 1]).setDate(
                  new Date(date_list[date_list.length - 1]).getDate()
                ),
                //   y: null,
              },

              // // On category scale, factor of pan velocity
              // speed: 40,

              // // Minimal pan distance required before actually applying pan
              // threshold: 10,

              // Function called while the user is panning
              onPan: function () {
                setIsGrabbed(true);
              },
              // // Function called once panning is completed
              onPanComplete: function ({ chart }: { chart: any }) {
                const from = chart.scales["x-axis-0"].ticks[0];
                const range = chart.scales["x-axis-0"].ticks.length - 1;
                setCurrentVisibleTicks({
                  from: moment(from).format(`[${moment().year()}]-MM-DD`),
                  range,
                });
                setIsGrabbed(false);
              },
            },
            // Container for zoom options
            zoom: {
              // Boolean to enable zooming
              enabled: false,

              // Enable drag-to-zoom behavior
              // drag: true,

              // Drag-to-zoom effect can be customized
              // drag: {
              // 	 borderColor: 'rgba(225,225,225,0.3)'
              // 	 borderWidth: 5,
              // 	 backgroundColor: 'rgb(225,225,225)',
              // 	 animationDuration: 0
              // },

              // Zooming directions. Remove the appropriate direction to disable
              // Eg. 'y' would only allow zooming in the y direction
              // A function that is called as the user is zooming and returns the
              // available directions can also be used:
              //   mode: function({ chart: any }) {
              //     return 'xy';
              //   },
              mode: "x",

              rangeMin: {
                // Format of min zoom range depends on scale type
                x: new Date(date_list[0]).setHours(
                  new Date(date_list[0]).getHours() - 4
                ),
                // x: moment.min(data.map((h) => moment(h.date))).format("DD MMM"),
                // y: null,
              },
              rangeMax: {
                // Format of max zoom range depends on scale type
                x: new Date(date_list[date_list.length - 1]).setDate(
                  new Date(date_list[date_list.length - 1]).getDate()
                ),
                // y: null,
              },

              // // Speed of zoom via mouse wheel
              // // (percentage of zoom on a wheel event)
              // speed: 0.1,

              // // Minimal zoom distance required before actually applying zoom
              // threshold: 2,

              // // On category scale, minimal zoom level before actually applying zoom
              // sensitivity: 3,

              // Function called while the user is zooming
              onZoom: function () {},
              // // Function called once zooming is completed
              // onZoomComplete: function ({ chart: any }) {
              // },
            },
          },
        },
      },
    });
    return () => {
      chart.current && chart.current.destroy && chart.current.destroy();
    };
  }, [JSON.stringify(data)]);

  const updateRange = (newRange: {
    from: string;
    to: string;
    range: number;
    data: string[];
  }) => {
    const minTime = newRange.from;
    const maxTime = newRange.to;
    if (chart.current?.options?.scales?.xAxes?.[0].ticks) {
      chart.current.options.scales.xAxes[0].ticks.min = minTime;
      chart.current.options.scales.xAxes[0].ticks.max = maxTime;
      chart.current.update();

      setCurrentVisibleTicks({ from: newRange.from, range: newRange.range });
    }
  };

  const handleBackClick = () => {
    const { from, range } = currentVisibleTicks;
    // const positiveRangeFrom = getDateRange({
    //   data: date_list,
    //   minVisible: minVisible,
    //   from: from,
    //   range: range,
    // });
    const newRange = getDateRange({
      data: date_list,
      minVisible: minVisible,
      from: from,
      range: -Math.abs(range),
    });
    updateRange(newRange);
  };
  const handleForwardClick = () => {
    const { from, range } = currentVisibleTicks;
    const positiveRangeFrom = getDateRange({
      data: date_list,
      minVisible: minVisible,
      from: from,
      range: range,
    });
    const newRange = getDateRange({
      data: date_list,
      minVisible: minVisible,
      from: positiveRangeFrom.to,
      range: Math.abs(range),
    });
    updateRange(newRange);
  };

  const getUniqueVisibleMonth = () => {
    const currentVisibleRange = getDateRange({
      data: date_list,
      minVisible: minVisible,
      from: currentVisibleTicks.from,
      range: currentVisibleTicks.range,
    });
    const dates = currentVisibleRange.data;

    const visibleMonths = dates.map((d) => moment(d).format("MMMM"));
    return [...new Set(visibleMonths)];
  };
  return (
    <div className="bg-[#F0F3FE] rounded-lg p-4">
      <div className="pl-2 pb-2">
        <div className="flex justify-between">
          <p className="text-lg font-medium mb-6">
            {getUniqueVisibleMonth().join("-")}
          </p>
          <div>
            <button
              onClick={handleBackClick}
              className="bg-white p-1 rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <button
              onClick={handleForwardClick}
              className="bg-white p-1 rounded-full ml-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <canvas id="myChart" ref={canvas} />
    </div>
  );
};

export default Chart;
