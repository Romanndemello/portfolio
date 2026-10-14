import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { pt } from "@/content/pt";
import { Cv } from "./Cv";

test("CV lista todas as experiências em ordem e o contato", () => {
  render(<Cv content={pt} />);
  const headings = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
  expect(headings).toEqual(pt.jobs.map((j) => `${j.role} · ${j.company}`));
  expect(screen.getByText(/dartagnanromann@gmail.com/)).toBeInTheDocument();
});

test("CV mostra a formação com a previsão de conclusão", () => {
  render(<Cv content={pt} />);
  expect(screen.getByText(pt.education.course, { exact: false })).toBeInTheDocument();
  expect(screen.getByText(pt.education.period, { exact: false })).toBeInTheDocument();
});
