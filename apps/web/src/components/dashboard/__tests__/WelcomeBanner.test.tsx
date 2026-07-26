import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { WelcomeBanner } from "../WelcomeBanner";

describe("WelcomeBanner Component", () => {
  it("should render student name and trigger voice summary on button click", () => {
    const handleSpeak = vi.fn();
    const handleTour = vi.fn();

    render(
      <WelcomeBanner
        studentName="Maria"
        pendingToday={2}
        isSimplified={false}
        onSpeakSummary={handleSpeak}
        onStartTour={handleTour}
      />
    );

    expect(screen.getByText(/Maria!/i)).toBeInTheDocument();
    expect(screen.getByText(/Você tem 2 atividades pendentes hoje/i)).toBeInTheDocument();

    const voiceBtn = screen.getByRole("button", { name: /Ouvir resumo por voz/i });
    fireEvent.click(voiceBtn);

    expect(handleSpeak).toHaveBeenCalledTimes(1);
  });

  it("should display simplified mode badge when isSimplified is true", () => {
    render(
      <WelcomeBanner
        studentName="João"
        pendingToday={0}
        isSimplified={true}
        onSpeakSummary={vi.fn()}
        onStartTour={vi.fn()}
      />
    );

    expect(screen.getByText(/MODO SIMPLIFICADO ATIVO/i)).toBeInTheDocument();
  });
});
