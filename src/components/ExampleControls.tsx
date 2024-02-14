/* eslint-disable jsx-a11y/accessible-emoji */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useCallback, useState } from "react";
import { lightTheme, darkTheme, type XYChartTheme } from "@visx/xychart";
import { PatternLines } from "@visx/pattern";
import { AnimationTrajectory } from "@visx/react-spring/lib/types";
import cityTemperature, {
  type CityTemperature,
} from "@visx/mock-data/lib/mocks/cityTemperature";
import { GlyphCross, GlyphDot, GlyphStar } from "@visx/glyph";
import { curveLinear, curveStep, curveCardinal } from "@visx/curve";
import { RenderTooltipGlyphProps } from "@visx/xychart/lib/components/Tooltip";
import customTheme from "./customTheme";
import userPrefersReducedMotion from "./userPrefersReducedMotion";
import getAnimatedOrUnanimatedComponents from "./getAnimatedOrUnanimatedComponents";

const dateScaleConfig = { type: "band", paddingInner: 0.3 } as const;
const temperatureScaleConfig = { type: "linear" } as const;
const data = cityTemperature.slice(0, 275);
const dataMissingValues = data.map((d, i) =>
  i === 10 || i === 11
    ? {
        ...d,
        "San Francisco": "nope",
        "New York": "notanumber",
        Austin: "null",
      }
    : d
);
const dataSmall = data.slice(0, 15);
const dataSmallMissingValues = dataMissingValues.slice(0, 15);
const getDate = (d: CityTemperature) => d.date;
const getSfTemperature = (d: CityTemperature) => Number(d["San Francisco"]);
const getNegativeSfTemperature = (d: CityTemperature) => -getSfTemperature(d);
const getNyTemperature = (d: CityTemperature) => Number(d["New York"]);
const getAustinTemperature = (d: CityTemperature) => Number(d.Austin);
const defaultAnnotationDataIndex = 13;
const selectedDatumPatternId = "xychart-selected-datum";

type Accessor = (d: CityTemperature) => number | string;

interface Accessors {
  "San Francisco": Accessor;
  "New York": Accessor;
  Austin: Accessor;
}

type DataKey = keyof Accessors;

type SimpleScaleConfig = { type: "band" | "linear"; paddingInner?: number };

type ProvidedProps = {
  accessors: {
    x: Accessors;
    y: Accessors;
    date: Accessor;
  };
  annotationDataKey: DataKey | null;
  annotationDatum?: CityTemperature;
  annotationLabelPosition: { dx: number; dy: number };
  annotationType?: "line" | "circle";
  config: {
    x: SimpleScaleConfig;
    y: SimpleScaleConfig;
  };
  curve: typeof curveLinear | typeof curveCardinal 
  // | typeof curveStep;
  data: CityTemperature[];
  editAnnotationLabelPosition: boolean;
  setAnnotationDataIndex: (index: number) => void;
  setAnnotationDataKey: (key: DataKey | null) => void;
  setAnnotationLabelPosition: (position: { dx: number; dy: number }) => void;
  sharedTooltip: boolean;
  showHorizontalCrosshair: boolean;
  showTooltip: boolean;
  showVerticalCrosshair: boolean;
  snapTooltipToDatumX: boolean;
  snapTooltipToDatumY: boolean;
  theme: XYChartTheme;
} & ReturnType<typeof getAnimatedOrUnanimatedComponents>;

type ControlsProps = {
  children: (props: ProvidedProps) => React.ReactNode;
};

export default function ExampleControls({ children }: ControlsProps) {
  const [useAnimatedComponents, setUseAnimatedComponents] = useState(
    !userPrefersReducedMotion()
  );
  const [theme, setTheme] = useState<XYChartTheme>(darkTheme);
  const [showTooltip, setShowTooltip] = useState(true);
  const [annotationDataKey, setAnnotationDataKey] =
    useState<ProvidedProps["annotationDataKey"]>(null);
  const [annotationType, setAnnotationType] =
    useState<ProvidedProps["annotationType"]>("circle");
  const [showVerticalCrosshair, setShowVerticalCrosshair] = useState(true);
  const [showHorizontalCrosshair, setShowHorizontalCrosshair] = useState(true);
  const [snapTooltipToDatumX, setSnapTooltipToDatumX] = useState(true);
  const [snapTooltipToDatumY, setSnapTooltipToDatumY] = useState(true);
  const [sharedTooltip, setSharedTooltip] = useState(true);
  const [editAnnotationLabelPosition, setEditAnnotationLabelPosition] =
    useState(false);
  const [annotationLabelPosition, setAnnotationLabelPosition] = useState({
    dx: -40,
    dy: -20,
  });
  const [annotationDataIndex, setAnnotationDataIndex] = useState(
    defaultAnnotationDataIndex
  );
  const [negativeValues, setNegativeValues] = useState(false);
  const [fewerDatum, setFewerDatum] = useState(false);
  const [missingValues, setMissingValues] = useState(false);
  const [curveType, setCurveType] = useState<"linear" | "cardinal" | "step">(
    "linear"
  );
  const accessors = {
    x: {
      "San Francisco": getDate,
      "New York": getDate,
      Austin: getDate,
    },
    y: {
      "San Francisco": negativeValues
        ? getNegativeSfTemperature
        : getSfTemperature,
      "New York": getNyTemperature,
      Austin: getAustinTemperature,
    },
    date: getDate,
  };

  const config = {
    x: dateScaleConfig,
    y: temperatureScaleConfig,
  };

  return (
    <>
      {children({
        accessors,
        annotationDataKey,
        annotationDatum: data[annotationDataIndex],
        annotationLabelPosition,
        annotationType,
        config,
        curve:
          (curveType === "cardinal" && curveCardinal) ||
          (curveType === "step" && curveStep) ||
          curveLinear,
        data: fewerDatum
          ? missingValues
            ? dataSmallMissingValues
            : dataSmall
          : missingValues
          ? dataMissingValues
          : data,
        editAnnotationLabelPosition,
        setAnnotationDataIndex,
        setAnnotationDataKey,
        setAnnotationLabelPosition,
        sharedTooltip,
        showHorizontalCrosshair,
        showTooltip,
        showVerticalCrosshair,
        snapTooltipToDatumX,
        snapTooltipToDatumY,
        theme,
        ...getAnimatedOrUnanimatedComponents(useAnimatedComponents),
      })}
      {/** This style is used for annotated elements via colorAccessor. */}
      <svg className="pattern-lines">
        <PatternLines
          id={selectedDatumPatternId}
          width={6}
          height={6}
          orientation={["diagonalRightToLeft"]}
          stroke={theme?.axisStyles.x.bottom.axisLine.stroke}
          strokeWidth={1.5}
        />
      </svg>
      <div className="controls">
        {/** data */}
        <div>
          <strong>data</strong>
          <label>
            <input
              type="checkbox"
              onChange={() => setNegativeValues(!negativeValues)}
              checked={negativeValues}
            />
            negative values (SF)
          </label>
          <label>
            <input
              type="checkbox"
              onChange={() => setMissingValues(!missingValues)}
              checked={missingValues}
            />
            missing values
          </label>
          <label>
            <input
              type="checkbox"
              onChange={() => setFewerDatum(!fewerDatum)}
              checked={fewerDatum}
            />
            fewer datum
          </label>
        </div>

        {/** theme */}
        <div>
          <strong>theme</strong>
          <label>
            <input
              type="radio"
              onChange={() => setTheme(lightTheme)}
              checked={theme === lightTheme}
            />
            light
          </label>
          <label>
            <input
              type="radio"
              onChange={() => setTheme(darkTheme)}
              checked={theme === darkTheme}
            />
            dark
          </label>
          <label>
            <input
              type="radio"
              onChange={() => setTheme(customTheme)}
              checked={theme === customTheme}
            />
            custom
          </label>
        </div>

        <br />

        {/** series */}
        <div>
          <strong>curve shape</strong>
          <label>
            <input
              type="radio"
              onChange={() => setCurveType("linear")}
              checked={curveType === "linear"}
            />
            linear
          </label>
          <label>
            <input
              type="radio"
              onChange={() => setCurveType("cardinal")}
              checked={curveType === "cardinal"}
            />
            cardinal (smooth)
          </label>
          <label>
            <input
              type="radio"
              onChange={() => setCurveType("step")}
              checked={curveType === "step"}
            />
            step
          </label>
        </div>
        {/** tooltip */}
        <div>
          <strong>tooltip</strong>
          <label>
            <input
              type="checkbox"
              onChange={() => setShowTooltip(!showTooltip)}
              checked={showTooltip}
            />
            show tooltip
          </label>
          <label>
            <input
              type="checkbox"
              disabled={!showTooltip}
              onChange={() => setSnapTooltipToDatumX(!snapTooltipToDatumX)}
              checked={showTooltip && snapTooltipToDatumX}
            />
            snap tooltip to datum x
          </label>
          <label>
            <input
              type="checkbox"
              disabled={!showTooltip}
              onChange={() => setSnapTooltipToDatumY(!snapTooltipToDatumY)}
              checked={showTooltip && snapTooltipToDatumY}
            />
            snap tooltip to datum y
          </label>
          <label>
            <input
              type="checkbox"
              disabled={!showTooltip}
              onChange={() => setShowVerticalCrosshair(!showVerticalCrosshair)}
              checked={showTooltip && showVerticalCrosshair}
            />
            vertical crosshair
          </label>
          <label>
            <input
              type="checkbox"
              disabled={!showTooltip}
              onChange={() =>
                setShowHorizontalCrosshair(!showHorizontalCrosshair)
              }
              checked={showTooltip && showHorizontalCrosshair}
            />
            horizontal crosshair
          </label>
          <label>
            <input
              type="checkbox"
              disabled={!showTooltip}
              onChange={() => setSharedTooltip(!sharedTooltip)}
              checked={showTooltip && sharedTooltip}
            />
            shared tooltip
          </label>
        </div>
        {/** annotation */}
        <div>
          <strong>annotation</strong> (click chart to update)
          <label>
            <input
              type="radio"
              onChange={() => setAnnotationDataKey(null)}
              checked={annotationDataKey == null}
            />
            none
          </label>
          <label>
            <input
              type="radio"
              onChange={() => setAnnotationDataKey("San Francisco")}
              checked={annotationDataKey === "San Francisco"}
            />
            SF
          </label>
          <label>
            <input
              type="radio"
              onChange={() => setAnnotationDataKey("New York")}
              checked={annotationDataKey === "New York"}
            />
            NY
          </label>
          <label>
            <input
              type="radio"
              onChange={() => setAnnotationDataKey("Austin")}
              checked={annotationDataKey === "Austin"}
            />
            Austin
          </label>
          &nbsp;&nbsp;&nbsp;
          <strong>type</strong>
          <label>
            <input
              type="radio"
              onChange={() => setAnnotationType("circle")}
              checked={annotationType === "circle"}
            />
            circle
          </label>
          <label>
            <input
              type="radio"
              onChange={() => setAnnotationType("line")}
              checked={annotationType === "line"}
            />
            line
          </label>
          &nbsp;&nbsp;&nbsp;
          <label>
            <input
              type="checkbox"
              onChange={() =>
                setEditAnnotationLabelPosition(!editAnnotationLabelPosition)
              }
              checked={editAnnotationLabelPosition}
            />
            edit label position
          </label>
        </div>
      </div>
      <style jsx>{`
        .controls {
          font-size: 13px;
          line-height: 1.5em;
        }
        .controls > div {
          margin-bottom: 4px;
        }
        label {
          font-size: 12px;
        }
        input[type="radio"] {
          height: 10px;
        }
        .pattern-lines {
          position: absolute;
          pointer-events: none;
          opacity: 0;
        }
      `}</style>
    </>
  );
}
