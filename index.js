const defaultOptions = {
  graphStyle: {
    width: "1000px",
    height: "1000px",
    margin: "5px",
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

const createVerticalBars = (
  graphDiv,
  barInfo,
  averageWidthOfPixelsPerGroup,
  largestDataPoint
) => {
  const numberOfBars = barInfo.barGraphContinaerConfig.graphInfo.dataInterval
    ? Math.floor(
        largestDataPoint /
          barInfo.barGraphContinaerConfig.graphInfo.dataInterval
      )
    : Math.floor(largestDataPoint / barInfo.arrayOfInfo.length);
  const widthValue = barInfo.barGraphContinaerConfig.graphInfo.dataInterval
    ? parsePixelsIntoNumber(barInfo.barGraphContinaerConfig.graphStyle.width) /
      (largestDataPoint /
        barInfo.barGraphContinaerConfig.graphInfo.dataInterval)
    : parsePixelsIntoNumber(barInfo.barGraphContinaerConfig.graphStyle.width) /
      numberOfBars;

  for (let i = 0; i < numberOfBars; i++) {
    const verticalBar = document.createElement("div");
    verticalBar.style.boxSizing = "border-box";
    verticalBar.style.height = "100%";
    verticalBar.style.width = "1px";
    verticalBar.style.borderLeft = "1px dotted black";
    verticalBar.style.left = `${widthValue * (i + 1)}px`;
    verticalBar.style.zIndex = "-1";
    verticalBar.style.position = "absolute";

    const valueLabel = document.createElement("div");
    valueLabel.style.whiteSpace = "pre";
    valueLabel.style.position = "absolute";
    valueLabel.style.left = `${widthValue * (i + 1) - 10}px`;
    valueLabel.style.bottom = `-20px`;
    valueLabel.appendChild(
      document.createTextNode(
        barInfo.barGraphContinaerConfig.graphInfo.dataInterval
          ? `${
              barInfo.barGraphContinaerConfig.graphInfo.dataInterval * (i + 1)
            } ${barInfo.barGraphContinaerConfig.graphInfo.dataIntervalUnit}`
          : `${(largestDataPoint / numberOfBars) * (i + 1)} \n${
              barInfo.barGraphContinaerConfig.graphInfo.dataIntervalUnit
            }`
      )
    );

    graphDiv.appendChild(verticalBar);
    graphDiv.appendChild(valueLabel);
  }
};

const createGraphContainerElement = (
  barInfo,
  averageWidthOfPixelsPerGroup,
  largestDataPoint
) => {
  const divBarContinerElement = document.createElement("div");

  divBarContinerElement.style.position = "relative";

  divBarContinerElement.style.width =
    barInfo.barGraphContinaerConfig.graphStyle.width;
  divBarContinerElement.style.height =
    barInfo.barGraphContinaerConfig.graphStyle.height;

  divBarContinerElement.style.borderLeft = `1px solid black`; // TO DO: Change with dynamic data
  divBarContinerElement.style.boxSizing = "border-box";

  createVerticalBars(
    divBarContinerElement,
    barInfo,
    averageWidthOfPixelsPerGroup,
    largestDataPoint
  );

  return divBarContinerElement;
};

const createBarDivs = (barInfo) => {
  const fullCopyOfBarInfo = JSON.parse(JSON.stringify(barInfo.arrayOfInfo));
  const largestDataPoint = barInfo.isBarDataAnArrayOfObjects
    ? calculateNestedObjLargestValue(barInfo.arrayOfInfo)
    : fullCopyOfBarInfo.sort((a, b) => {
        return b - a;
      })[0];

  const averageWidthOfPixelsPerGroup = Math.round(
    parsePixelsIntoNumber(barInfo.barGraphContinaerConfig.graphStyle.width) /
      largestDataPoint
  );

  const averageHeightOfPixelsPerGroup =
    Math.round(
      parsePixelsIntoNumber(barInfo.barGraphContinaerConfig.graphStyle.height) /
        barInfo.arrayOfInfo.length
    ) -
    barInfo.arrayOfInfo.length *
      parsePixelsIntoNumber(barInfo.barGraphContinaerConfig.graphStyle.margin);

  const divBarContinerElement = createGraphContainerElement(
    barInfo,
    averageWidthOfPixelsPerGroup,
    largestDataPoint
  );

  barInfo.arrayOfInfo.forEach((info, index) => {
    const divElement = document.createElement("div");
    divElement.style.margin = `${barInfo.barGraphContinaerConfig.graphStyle.margin} 0`;

    if (barInfo.isBarDataAnArrayOfObjects) {
      info.arrayOfBarGroupInfo.forEach((infoObj) => {
        const innerBarDiv = document.createElement("div");
        innerBarDiv.style.width = `${Math.floor(
          averageWidthOfPixelsPerGroup * infoObj.value
        )}px`;
        innerBarDiv.style.height = `${Math.floor(
          averageHeightOfPixelsPerGroup / info.arrayOfBarGroupInfo.length
        )}px`;

        innerBarDiv.style.backgroundColor =
          infoObj.barColor || barInfo.barGraphContinaerConfig.defaultBarColor;

        divElement.appendChild(innerBarDiv);
        divBarContinerElement.appendChild(divElement);
      });
      return;
    }

    divElement.style.backgroundColor = barInfo.barGraphContinaerConfig
      .barViewData
      ? barInfo.barGraphContinaerConfig.barViewData[index].barColor
      : barInfo.barGraphContinaerConfig.defaultBarColor;
    divElement.style.width = `${
      averageWidthOfPixelsPerGroup * info >
      parsePixelsIntoNumber(barInfo.barGraphContinaerConfig.graphStyle.width)
        ? barInfo.barGraphContinaerConfig.graphStyle.width
        : averageWidthOfPixelsPerGroup * info
    }px`;

    divElement.style.height = `${averageHeightOfPixelsPerGroup}px`;

    const valueText = document.createTextNode(info);
    divElement.appendChild(valueText);

    divBarContinerElement.appendChild(divElement);
  });

  return divBarContinerElement;
};

const drawBarChart = (data, options, element) => {
  // Data represents the bars information and values - Array of information
  // options represent the entire bar graph ex: title, width & height of the whole container, etc
  // element

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
      },
      arrayOfInfo: data,
      isBarDataAnArrayOfObjects: data.every(isBarDataAnArrayOfObjects),
    };

    selectedElement.appendChild(createBarDivs(barInfo));

    resolve(createAPIResponses(200, "Sucessfully created Bar Graph"));
  });
};

drawBarChart(
  //   [
  //     {
  //       arrayOfBarGroupInfo: [
  //         { barColor: "grey", value: 16 },
  //         { barColor: "orange", value: 10 },
  //         { barColor: "pink", value: 10 },
  //       ],
  //     },
  //     {
  //       arrayOfBarGroupInfo: [
  //         { barColor: "red", value: 35 },
  //         { barColor: "blue", value: 22 },
  //       ],
  //     },
  //   ],
  [10, 20, 30],
  {
    barViewData: [
      {
        barColor: "red",
        valueInfo: {
          position: "top",
          color: "white",
          fontSize: "20px",
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
    },
    graphInfo: {
      oppositeAxisLabel: "Number of X",
      barDirection: "Horizontal",
      title: "Ben's Test",
      dataInterval: "5",
      dataIntervalUnit: "points",
    },
  },
  "#root"
);
