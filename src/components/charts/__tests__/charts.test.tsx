import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { BarChart } from "@/components/charts/bar-chart";
import { DonutChart } from "@/components/charts/donut-chart";
import { LineChart } from "@/components/charts/line-chart";

describe("BarChart", () => {
  it("renders a role=img with default aria-label including data", () => {
    render(
      <BarChart
        data={[
          { label: "Seg", value: 3 },
          { label: "Ter", value: 5 },
        ]}
      />,
    );
    const img = screen.getByRole("img");
    expect(img.getAttribute("aria-label")).toContain("Seg 3");
    expect(img.getAttribute("aria-label")).toContain("Ter 5");
  });

  it("renders bar labels for each datum", () => {
    render(
      <BarChart
        data={[
          { label: "Seg", value: 1 },
          { label: "Ter", value: 0 },
        ]}
      />,
    );
    expect(screen.getByText("Seg")).toBeInTheDocument();
    expect(screen.getByText("Ter")).toBeInTheDocument();
  });
});

describe("DonutChart", () => {
  it("renders a role=img and shows total in the center by default", () => {
    render(
      <DonutChart
        segments={[
          { label: "A", value: 3 },
          { label: "B", value: 7 },
        ]}
      />,
    );
    expect(screen.getByRole("img")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
  });

  it("shows em-dash when there is no data", () => {
    render(<DonutChart segments={[]} />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });
});

describe("LineChart", () => {
  it("renders a role=img with point summary in default aria-label", () => {
    render(
      <LineChart
        points={[
          { label: "Jan", value: 4 },
          { label: "Fev", value: 6 },
        ]}
      />,
    );
    const img = screen.getByRole("img");
    expect(img.getAttribute("aria-label")).toContain("Jan 4");
    expect(img.getAttribute("aria-label")).toContain("Fev 6");
  });

  it("respects a custom aria-label", () => {
    render(
      <LineChart
        ariaLabel="Mensal"
        points={[{ label: "Jan", value: 1 }]}
      />,
    );
    expect(screen.getByRole("img").getAttribute("aria-label")).toBe("Mensal");
  });
});
