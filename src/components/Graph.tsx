import { type CityTemperature } from "@visx/mock-data/lib/mocks/cityTemperature";

import ExampleControls from "./ExampleControls";

export type XYChartProps = {
  width: number;
  height: number;
};

type City = "San Francisco" | "New York" | "Austin";

export default function Example({ width, height }: XYChartProps) {
  return (
    <ExampleControls>
      {({
        accessors,
        annotationDataKey,
        annotationDatum,
        annotationLabelPosition,
        annotationType,
        config,
        curve,
        data,
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

        // components are animated or not depending on selection
        Annotation,
        Axis,
        LineSeries,
        AnnotationCircleSubject,
        AnnotationConnector,
        AnnotationLabel,
        AnnotationLineSubject,
        Tooltip,
        XYChart,
      }) => (
        <>
          {/* <pre>{JSON.stringify(data,null,2)}</pre> */}
          <XYChart
            theme={theme}
            xScale={config.x}
            yScale={config.y}
            width={width}
            height={height}
            captureEvents={!editAnnotationLabelPosition}
            onPointerUp={(d) => {
              setAnnotationDataKey(
                d.key as "New York" | "San Francisco" | "Austin"
              );
              setAnnotationDataIndex(d.index);
            }}
          >
            <LineSeries
              dataKey="Austin"
              data={data}
              xAccessor={accessors.x.Austin}
              yAccessor={accessors.y.Austin}
              curve={curve}
            />
            <LineSeries
              dataKey="New York"
              data={data}
              xAccessor={accessors.x["New York"]}
              yAccessor={accessors.y["New York"]}
              curve={curve}
            />
            <LineSeries
              dataKey="San Francisco"
              data={data}
              xAccessor={accessors.x["San Francisco"]}
              yAccessor={accessors.y["San Francisco"]}
              curve={curve}
            />
            <Axis
              key="time-axis-min"
              orientation={"bottom"}
              numTicks={15}
              animationTrajectory="min"
            />
            <Axis
              key="temp-axis-min"
              label={"Temperature (°F)"}
              orientation={"right"}
              numTicks={4}
              animationTrajectory="min"
            />
            {annotationDataKey && annotationDatum && (
              <Annotation
                dataKey={annotationDataKey}
                datum={annotationDatum}
                dx={annotationLabelPosition.dx}
                dy={annotationLabelPosition.dy}
                editable={editAnnotationLabelPosition}
                canEditSubject={false}
                onDragEnd={({ dx, dy }) =>
                  setAnnotationLabelPosition({ dx, dy })
                }
              >
                <AnnotationConnector />
                {annotationType === "circle" ? (
                  <AnnotationCircleSubject />
                ) : (
                  <AnnotationLineSubject />
                )}
                <AnnotationLabel
                  title={annotationDataKey}
                  subtitle={`${annotationDatum.date}, ${annotationDatum[annotationDataKey]}°F`}
                  width={135}
                  backgroundProps={{
                    stroke: theme.gridStyles.stroke,
                    strokeOpacity: 0.5,
                    fillOpacity: 0.8,
                  }}
                />
              </Annotation>
            )}
            {showTooltip && (
              <Tooltip<CityTemperature>
                showHorizontalCrosshair={showHorizontalCrosshair}
                showVerticalCrosshair={showVerticalCrosshair}
                snapTooltipToDatumX={snapTooltipToDatumX}
                snapTooltipToDatumY={snapTooltipToDatumY}
                showDatumGlyph={snapTooltipToDatumX || snapTooltipToDatumY}
                showSeriesGlyphs={sharedTooltip}
                renderTooltip={({ tooltipData, colorScale }) => (
                  <>
                    {/** date */}
                    {(tooltipData?.nearestDatum?.datum &&
                      accessors.date(tooltipData?.nearestDatum?.datum)) ??
                      "No date"}
                    <br />
                    <br />
                    {/** temperatures */}
                    {(
                      (sharedTooltip
                        ? Object.keys(tooltipData?.datumByKey ?? {})
                        : [tooltipData?.nearestDatum?.key]
                      ).filter((city) => city) as City[]
                    ).map((city) => {
                      const temperature =
                        tooltipData?.nearestDatum?.datum &&
                        accessors.y[city](tooltipData?.nearestDatum?.datum);

                      return (
                        <div key={city}>
                          <em
                            style={{
                              color: colorScale?.(city),
                              textDecoration:
                                tooltipData?.nearestDatum?.key === city
                                  ? "underline"
                                  : undefined,
                            }}
                          >
                            {city}
                          </em>{" "}
                          {temperature == null || Number.isNaN(temperature)
                            ? "–"
                            : `${temperature}° F`}
                        </div>
                      );
                    })}
                  </>
                )}
              />
            )}
          </XYChart>
        </>
      )}
    </ExampleControls>
  );
}
