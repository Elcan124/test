import React from "react";
import { Chart } from "react-google-charts";


export const data = [
    ["Aralıq", "Adamlar"],
    ["6.7-7.5", 1000],
    ["7.7-17.5", 1170],
    ["17.5-25.8", 660],
    ["25.8-50.8", 1030],
];

export const options = {
    /*chart: {
        title: "Company Performance",
        subtitle: "Sales, Expenses, and Profit: 2014-2017",
    }*/
};

export function GoogleHistogram() {
    return (
        <Chart
            chartType="Bar"
            width="700px"
            height="400px"
            data={data}
            options={options}
            chartEvents={[
                {
                    eventName: "ready",

                    callback: ({ chartWrapper, google }) => {
                        const chart = chartWrapper.getChart();
                        google.visualization.events.addListener(chart, "onmouseover", e => {
                            const { row, column } = e;
                            console.warn("MOUSE OVER ", { row, column });
                        });
                        google.visualization.events.addListener(chart, "onmousehover", e => {
                            const { row, column } = e;
                            console.warn("MOUSE HOVER ", { row, column });
                        });
                        google.visualization.events.addListener(chart, "click", e => {
                            const { row, column } = e;
                            console.warn("MOUSE CLICK ", { row, column });
                        });

                    }
                }
            ]}
        />
    );
}
