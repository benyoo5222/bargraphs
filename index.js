const defaultOptions = {
  graphStyle: {
    width: "1000px",
    height: "1000px",
    margin: "5px",
  },
  graphInfo: {
    horizontalDirection: true,
  },
  defaultBarColor: "black",
};

const createAPIResponses = (statusCode, message) => {
  return {
    statusCode,
    message,
  };
};

const parsePixelsIntoNumber = (dimensions) => {
  return Number(dimensions.match(/[0-9]/g).join(""));
};

const checkBarInfoObjIsValid = (currentObj) => {
  return currentObj.value;
};

const isBarDataAnArrayOfObjects = (currentValue) => {
  return currentValue.arrayOfBarGroupInfo
    ? currentValue.arrayOfBarGroupInfo.length > 0
      ? currentValue.arrayOfBarGroupInfo.every(checkBarInfoObjIsValid)
      : false
    : false;
};

const checkIfBarInfoValid = (currentValue) => {
  return currentValue.arrayOfBarGroupInfo
    ? currentValue.arrayOfBarGroupInfo.length > 0
      ? currentValue.arrayOfBarGroupInfo.every(checkBarInfoObjIsValid)
      : false
    : !Number.isNaN(Number(currentValue));
};

const calculateNestedObjLargestValue = (arrayOfInfo) => {
  const barInfoTracker = {};
  for (let barGroupInfo of arrayOfInfo) {
    barGroupInfo.arrayOfBarGroupInfo.forEach((infoObj) => {
      barInfoTracker.largestNumber &&
      barInfoTracker.largestNumber > infoObj.value
        ? null
        : (barInfoTracker.largestNumber = infoObj.value);
    });
  }

  return barInfoTracker.largestNumber;
};

const calculateNumberOfBars = (arrayOfGroupedBarInfo) => {
  let totalNumberOfBars = 0;
  arrayOfGroupedBarInfo.forEach((barInfo) => {
    totalNumberOfBars += barInfo.arrayOfBarGroupInfo.length;
  });

  return totalNumberOfBars;
};

const createGraphContainerElement = (barInfo) => {
  const divBarContinerElement = document.createElement("div");
  // Display Flex
  divBarContinerElement.style.display = "flex";
  divBarContinerElement.style.flexDirection = "column";

  divBarContinerElement.style.width =
    barInfo.barGraphContinaerConfig.graphStyle.width;
  divBarContinerElement.style.height =
    barInfo.barGraphContinaerConfig.graphStyle.height;
  divBarContinerElement.style.boxSizing = "border-box";

  return divBarContinerElement;
};

const createTitleDivElements = (barInfo) => {
  const nameDivContainer = document.createElement("div");
  const emptySpace = document.createElement("div");
  const titleDiv = document.createElement("div");

  // Container styling
  nameDivContainer.style.display = "flex";
  nameDivContainer.style.flex = "1";
  // Empty Space styling
  emptySpace.style.flex = "2";

  // Title Div Styling
  titleDiv.style.flex = "8";
  // Title Div Text Node
  const graphTitleTextNode = document.createTextNode(
    barInfo.barGraphContinaerConfig.graphInfo.title
  );

  // Appened title text node to title div
  titleDiv.appendChild(graphTitleTextNode);

  // Add the empty space and the title DIV into the container
  nameDivContainer.appendChild(emptySpace);
  nameDivContainer.appendChild(titleDiv);

  return nameDivContainer;
};

const createValueLabelContainer = (barInfo) => {
  const valueLabelContainer = document.createElement("div");
  const valueLabelAxisTitle = document.createElement("div");

  // Value Label Container Styling
  valueLabelContainer.style.display = "flex";
  valueLabelContainer.style.flex = "2";
  valueLabelContainer.style.flexDirection = barInfo.barGraphContinaerConfig
    .graphInfo.horizontalDirection
    ? "row"
    : "column";

  // Value Label Axis Title Stlying
  valueLabelAxisTitle.style.display = "flex";
  valueLabelAxisTitle.style.flex = "1";
  valueLabelAxisTitle.style.flexDirection = barInfo.barGraphContinaerConfig
    .graphInfo.horizontalDirection
    ? "column"
    : "row";
  valueLabelAxisTitle.style.order = barInfo.barGraphContinaerConfig.graphInfo
    .horizontalDirection
    ? "1"
    : "2";
  valueLabelAxisTitle.style.justifyContent = "center";
  valueLabelAxisTitle.style.alignItems = "center";
  valueLabelAxisTitle.style.textAlign = "center";
  valueLabelAxisTitle.style.transform = "rotate(-90deg)";
  // Value Label Axis Title Text Nodes
  const valueLabelAxisTitleTextNode = document.createTextNode(
    barInfo.barGraphContinaerConfig.graphInfo.valueLabelTitle
  );
  // Append the text node to Value Label Axis Title Div
  valueLabelAxisTitle.appendChild(valueLabelAxisTitleTextNode);
  valueLabelContainer.appendChild(valueLabelAxisTitle);
  return valueLabelContainer;
};

const createValueIntervalsContainer = (
  barInfo,
  largestDataPoint,
  numberOfBars
) => {
  const valueIntervalDivContainer = document.createElement("div");
  const valueIntervalTitle = document.createElement("div");
  const valueIntervalsDiv = document.createElement("div");

  // Container styling
  valueIntervalDivContainer.style.display = "flex";
  valueIntervalDivContainer.style.flex = "8";
  valueIntervalDivContainer.style.flexDirection = barInfo
    .barGraphContinaerConfig.graphInfo.horizontalDirection
    ? "column"
    : "row";

  // Intervals Title DIV styling
  valueIntervalTitle.style.display = "flex";
  valueIntervalTitle.style.flex = "1";
  valueIntervalTitle.style.flexDirection = barInfo.barGraphContinaerConfig
    .graphInfo.horizontalDirection
    ? "column"
    : "row";
  valueIntervalTitle.style.order = barInfo.barGraphContinaerConfig.graphInfo
    .horizontalDirection
    ? "2"
    : "1";
  valueIntervalTitle.style.justifyContent = "center";
  valueIntervalTitle.style.alignItems = "center";
  // Intervals Title Text Node
  const valueIntervalTitleTextNode = document.createTextNode(
    barInfo.barGraphContinaerConfig.graphInfo.oppositeAxisLabelTitle
  );
  // Append the text node to Value interval Axis Title Div
  valueIntervalTitle.appendChild(valueIntervalTitleTextNode);

  // Value Intervals DIV styling
  valueIntervalsDiv.style.display = "flex";
  valueIntervalsDiv.style.flex = "1";
  valueIntervalsDiv.style.flexDirection = barInfo.barGraphContinaerConfig
    .graphInfo.horizontalDirection
    ? "row"
    : "column";
  valueIntervalsDiv.style.order = barInfo.barGraphContinaerConfig.graphInfo
    .horizontalDirection
    ? "1"
    : "2";
  valueIntervalsDiv.style.position = "relative";
  valueIntervalsDiv.style.alignItems = "center";
  valueIntervalsDiv.style.justifyContent = "space-between";

  const numberOfIntervals = barInfo.barGraphContinaerConfig.graphInfo
    .dataInterval
    ? Math.floor(
        largestDataPoint /
          barInfo.barGraphContinaerConfig.graphInfo.dataInterval
      )
    : Math.floor(
        largestDataPoint / Math.floor(largestDataPoint / numberOfBars)
      ) *
        Math.floor(largestDataPoint / numberOfBars) >=
      largestDataPoint
    ? Math.floor(largestDataPoint / numberOfBars)
    : Math.floor(largestDataPoint / numberOfBars) + 2;

  for (let i = 0; i <= numberOfIntervals; i++) {
    const valueInterval = document.createElement("div");
    valueInterval.style.fontSize = "18px";
    const intervalTextNode = document.createTextNode(
      barInfo.barGraphContinaerConfig.graphInfo.dataInterval
        ? `${barInfo.barGraphContinaerConfig.graphInfo.dataInterval * i} 
          ${barInfo.barGraphContinaerConfig.graphInfo.dataIntervalUnit}`
        : `${Math.floor(largestDataPoint / numberOfIntervals) * i} \n${
            barInfo.barGraphContinaerConfig.graphInfo.dataIntervalUnit
          }`
    );
    valueInterval.setAttribute("name", "intervalText");
    valueInterval.style.textAlign = i === 0 ? "none" : "center";
    valueInterval.appendChild(intervalTextNode);

    valueIntervalsDiv.appendChild(valueInterval);
  }
  // test
  valueIntervalDivContainer.setAttribute("name", "intervalDiv");

  valueIntervalDivContainer.appendChild(valueIntervalsDiv);
  valueIntervalDivContainer.appendChild(valueIntervalTitle);
  return valueIntervalDivContainer;
};

const createGraphBarsElement = (barInfo, largestDataPoint) => {
  const barElementsContainer = document.createElement("div");

  barElementsContainer.style.display = "flex";
  barElementsContainer.style.height = "100%";
  barElementsContainer.style.flex = "12";
  barElementsContainer.style.flexDirection = "column";
  barElementsContainer.style.backgroundColor =
    barInfo.barGraphContinaerConfig.graphStyle.barElementsBackgroundColor;

  barInfo.arrayOfInfo.forEach((info, index) => {
    const barElementsWithTitleContainer = document.createElement("div");
    barElementsWithTitleContainer.style.display = "flex";
    barElementsWithTitleContainer.style.flex = "1";

    const barElementWithLabel = document.createElement("div");
    barElementWithLabel.style.display = "flex";
    barElementWithLabel.style.flexDirection = "row";
    barElementWithLabel.style.flex = "14";

    const barLabelDiv = document.createElement("div");
    barLabelDiv.style.display = "flex";
    barLabelDiv.style.alignItems = "center";
    barLabelDiv.style.flex = "1";

    const barElement = document.createElement("div");
    barElement.style.margin = `${barInfo.barGraphContinaerConfig.graphStyle.margin} 0`;
    barElement.style.display = "flex";

    if (barInfo.isBarDataAnArrayOfObjects) {
      barElement.style.flex = "1";
      barElement.style.flexDirection = "column";

      // Labels
      const { title } = barInfo.arrayOfInfo[index];
      // Text nodes for each data per groupd DIV
      const eachDataPerGroupTextNode = document.createTextNode(title);
      barLabelDiv.appendChild(eachDataPerGroupTextNode);

      info.arrayOfBarGroupInfo.forEach((infoObj) => {
        const innerBarValueAndUnitContainer = document.createElement("div");
        innerBarValueAndUnitContainer.style.display = "flex";
        innerBarValueAndUnitContainer.style.flex = "1";

        const innerBarDiv = document.createElement("div");
        innerBarDiv.style.display = "flex";
        innerBarDiv.style.justifyContent = "center";
        innerBarDiv.style.alignItems = "center";
        innerBarDiv.style.color = infoObj.valueFontColor;

        innerBarDiv.style.width = `${
          (infoObj.value / largestDataPoint) * 100
        }%`;
        innerBarDiv.style.backgroundColor =
          infoObj.barColor || barInfo.barGraphContinaerConfig.defaultBarColor;

        const innerBarDivTextNode = document.createTextNode(infoObj.label);
        innerBarDiv.appendChild(innerBarDivTextNode);

        const textDiv = document.createElement("div");
        const valueText = document.createTextNode(
          `${infoObj.value}${barInfo.barGraphContinaerConfig.barViewData[index].valueInfo.unit}`
        );
        textDiv.appendChild(valueText);
        textDiv.style.display = "flex";
        textDiv.style.alignItems = "center";
        textDiv.style.marginLeft = "2px";
        textDiv.style.color = infoObj.labelFontColor;

        innerBarValueAndUnitContainer.appendChild(innerBarDiv);
        innerBarValueAndUnitContainer.appendChild(textDiv);

        barElement.appendChild(innerBarValueAndUnitContainer);
        barElementWithLabel.appendChild(barElement);
        barElementsWithTitleContainer.appendChild(barLabelDiv);
        barElementsWithTitleContainer.appendChild(barElementWithLabel);
        barElementsContainer.appendChild(barElementsWithTitleContainer);
      });
      return;
    }
    // If single data points instead of group
    const labelValueText = document.createTextNode(
      barInfo.barGraphContinaerConfig.barViewData[index].label.value
    );
    barLabelDiv.appendChild(labelValueText);

    barElement.style.backgroundColor = barInfo.barGraphContinaerConfig
      .barViewData
      ? barInfo.barGraphContinaerConfig.barViewData[index].barColor
      : barInfo.barGraphContinaerConfig.defaultBarColor;
    barElement.style.width = `${(info / largestDataPoint) * 100}%`;

    const barValueTextDiv = document.createElement("div");
    const valueText = document.createTextNode(
      `${info}${barInfo.barGraphContinaerConfig.barViewData[index].valueInfo.unit}`
    );
    barValueTextDiv.appendChild(valueText);
    barValueTextDiv.style.display = "flex";
    barValueTextDiv.style.alignItems = "center";
    barValueTextDiv.style.marginLeft = "2px";

    barElementWithLabel.appendChild(barElement);
    barElementWithLabel.appendChild(barValueTextDiv);
    barElementsWithTitleContainer.appendChild(barLabelDiv);
    barElementsWithTitleContainer.appendChild(barElementWithLabel);
    barElementsContainer.appendChild(barElementsWithTitleContainer);
  });

  return barElementsContainer;
};

const createGraphElements = (
  divBarContinerElement,
  barInfo,
  largestDataPoint,
  numberOfBars
) => {
  const topRowNameDivContainer = createTitleDivElements(barInfo);
  const valueLabelsContainer = createValueLabelContainer(barInfo);
  const valueIntervalsContainer = createValueIntervalsContainer(
    barInfo,
    largestDataPoint,
    numberOfBars
  );

  const barDataContainer = createGraphBarsElement(barInfo, largestDataPoint);

  // Container for bar data and labels
  const containerForLabelAndBar = document.createElement("div");
  containerForLabelAndBar.style.display = "flex";
  containerForLabelAndBar.style.flex = "9";

  containerForLabelAndBar.appendChild(valueLabelsContainer);
  containerForLabelAndBar.appendChild(barDataContainer);

  // intervalDIv
  const intervalDivContainer = document.createElement("div");
  intervalDivContainer.style.display = "flex";
  intervalDivContainer.style.flex = "2";
  const emptyDiv = document.createElement("div");

  // Empty Space styling
  emptyDiv.style.flex = "2";

  intervalDivContainer.appendChild(emptyDiv);
  intervalDivContainer.appendChild(valueIntervalsContainer);

  divBarContinerElement.appendChild(topRowNameDivContainer);
  divBarContinerElement.appendChild(containerForLabelAndBar);
  divBarContinerElement.appendChild(intervalDivContainer);

  return divBarContinerElement;
};

const createBarDivs = (barInfo) => {
  const fullCopyOfBarInfo = JSON.parse(JSON.stringify(barInfo.arrayOfInfo));
  const largestDataPoint = barInfo.isBarDataAnArrayOfObjects
    ? calculateNestedObjLargestValue(barInfo.arrayOfInfo)
    : fullCopyOfBarInfo.sort((a, b) => {
        return b - a;
      })[0];
  const numberOfBars = barInfo.isBarDataAnArrayOfObjects
    ? calculateNumberOfBars(barInfo.arrayOfInfo)
    : barInfo.arrayOfInfo.length;

  const divBarContinerElement = createGraphContainerElement(barInfo);

  const graphElements = createGraphElements(
    divBarContinerElement,
    barInfo,
    largestDataPoint,
    numberOfBars
  );

  return graphElements;
};

const drawBarChart = (data, options, element) => {
  // Data represents the bars information and values - Array of information
  // options represent the entire bar graph ex: title, width & height of the whole container, etc
  return new Promise((resolve, reject) => {
    const selectedElement = document.querySelector(element);

    if (selectedElement === null) {
      // TO DO: Build lib folder for API responses
      reject(createAPIResponses(400, `${element} element does not exist`));
    }

    if (!Array.isArray(data) || data.length === 0) {
      reject(
        createAPIResponses(400, "Please provide an array of bar information")
      );
    }

    if (!data.every(checkIfBarInfoValid)) {
      reject(
        createAPIResponses(400, "Please make sure your bar data is valid")
      );
    }
    // To Do: create Validation module for options object
    // To Do: create Validation for bar color length IF not nestedObjects

    const barInfo = {
      barGraphContinaerConfig: {
        ...defaultOptions,
        ...options,
        graphStyle: {
          ...defaultOptions.graphStyle,
          ...options.graphStyle,
        },
        graphInfo: {
          ...defaultOptions.graphInfo,
          ...options.graphInfo,
        },
      },
      arrayOfInfo: data,
      isBarDataAnArrayOfObjects: data.every(isBarDataAnArrayOfObjects),
    };

    selectedElement.appendChild(createBarDivs(barInfo));

    // Grab element for width check
    let overflowing = true;
    while (overflowing) {
      const intervalDiv = document.getElementsByName("intervalDiv");
      intervalDiv[0].style.overflow = "hidden";

      if (intervalDiv[0].clientWidth >= intervalDiv[0].scrollWidth) {
        overflowing = false;
        continue;
      }

      const arrayOfIntervals = document.getElementsByName("intervalText");
      arrayOfIntervals.forEach((intervalElement) => {
        intervalElement.style.fontSize =
          parsePixelsIntoNumber(
            window.getComputedStyle(intervalElement).fontSize
          ) -
          3 +
          "px";
      });
      continue;
    }

    resolve(createAPIResponses(200, "Sucessfully created Bar Graph"));
  });
};

drawBarChart(
  // [
  //   {
  //     arrayOfBarGroupInfo: [
  //       {
  //         barColor: "grey",
  //         value: 16,
  //         valueFontColor: "black",
  //         label: "test",
  //         labelFontColor: "black",
  //       },
  //       {
  //         barColor: "orange",
  //         value: 10,
  //         valueFontColor: "white",
  //         label: "test",
  //         labelFontColor: "black",
  //       },
  //       {
  //         barColor: "grey",
  //         value: 16,
  //         valueFontColor: "white",
  //         label: "test",
  //         labelFontColor: "black",
  //       },
  //       {
  //         barColor: "orange",
  //         value: 10,
  //         valueFontColor: "white",
  //         label: "test",
  //         labelFontColor: "black",
  //       },
  //       {
  //         barColor: "grey",
  //         value: 16,
  //         valueFontColor: "black",
  //         label: "test",
  //         labelFontColor: "black",
  //       },
  //       {
  //         barColor: "orange",
  //         value: 10,
  //         valueFontColor: "white",
  //         label: "test",
  //         labelFontColor: "black",
  //       },
  //       {
  //         barColor: "grey",
  //         value: 16,
  //         valueFontColor: "white",
  //         label: "test",
  //         labelFontColor: "black",
  //       },
  //       {
  //         barColor: "orange",
  //         value: 10,
  //         valueFontColor: "white",
  //         label: "test",
  //         labelFontColor: "black",
  //       },
  //     ],
  //     title: "boo",
  //   },
  //   {
  //     arrayOfBarGroupInfo: [
  //       {
  //         barColor: "grey",
  //         value: 16,
  //         valueFontColor: "white",
  //         label: "test",
  //         labelFontColor: "white",
  //       },
  //       {
  //         barColor: "orange",
  //         value: 10,
  //         valueFontColor: "white",
  //         label: "test",
  //         labelFontColor: "black",
  //       },
  //       {
  //         barColor: "grey",
  //         value: 16,
  //         valueFontColor: "white",
  //         label: "test",
  //         labelFontColor: "white",
  //       },
  //       {
  //         barColor: "orange",
  //         value: 10,
  //         valueFontColor: "white",
  //         label: "test",
  //         labelFontColor: "black",
  //       },
  //     ],
  //     title: "test",
  //   },
  //   {
  //     arrayOfBarGroupInfo: [
  //       {
  //         barColor: "grey",
  //         value: 16,
  //         valueFontColor: "white",
  //         label: "test",
  //         labelFontColor: "white",
  //       },
  //       {
  //         barColor: "orange",
  //         value: 10,
  //         valueFontColor: "white",
  //         label: "test",
  //         labelFontColor: "black",
  //       },
  //       {
  //         barColor: "grey",
  //         value: 16,
  //         valueFontColor: "orange",
  //         label: "test",
  //         labelFontColor: "black",
  //       },
  //       {
  //         barColor: "orange",
  //         value: 10,
  //         valueFontColor: "white",
  //         label: "test",
  //         labelFontColor: "black",
  //       },
  //     ],
  //     title: "test",
  //   },
  // ],
  [10, 20, 30],
  {
    barViewData: [
      {
        barColor: "red",
        valueInfo: {
          position: "top",
          color: "white",
          fontSize: "20px",
          unit: "%",
        },
        label: {
          value: "ABC",
          color: "blue",
        },
      },
      {
        barColor: "blue",
        valueInfo: {
          position: "top",
          color: "white",
          fontSize: "20px",
          unit: "%",
        },
        label: {
          value: "ABC",
          color: "blue",
        },
      },
      {
        barColor: "orange",
        valueInfo: {
          position: "top",
          color: "white",
          fontSize: "20px",
          unit: "%",
        },
        label: {
          value: "ABC",
          color: "blue",
        },
      },
    ],
    graphStyle: {
      width: "900px",
      height: "500px",
      barElementsBackgroundColor: "white",
    },
    graphInfo: {
      valueLabelTitle: "Basketball Stats",
      oppositeAxisLabelTitle: "Number of X",
      title: "Ben's Test",
      dataInterval: "5",
      dataIntervalUnit: "points",
    },
  },
  "#root"
);
