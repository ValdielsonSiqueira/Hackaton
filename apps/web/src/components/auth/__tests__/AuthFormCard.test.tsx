import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AuthFormCard } from "../AuthFormCard";
import { HelpProvider } from "../../../context/HelpContext";

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<HelpProvider>{ui}</HelpProvider>);
};

describe("AuthFormCard Component", () => {
  it("should render login fields and trigger validation on empty submit", () => {
    const handleSuccess = vi.fn();

    renderWithProviders(
      <AuthFormCard
        initialEmail=""
        onSuccess={handleSuccess}
      />
    );

    expect(screen.getByLabelText(/Seu e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Sua senha/i)).toBeInTheDocument();

    const submitBtn = screen.getByRole("button", { name: /Entrar na minha conta/i });
    fireEvent.click(submitBtn);

    expect(handleSuccess).not.toHaveBeenCalled();
    expect(screen.getByText(/Por favor, digite seu e-mail/i)).toBeInTheDocument();
  });

  it("should submit auth successfully when valid credentials are provided", () => {
    const handleSuccess = vi.fn();

    renderWithProviders(
      <AuthFormCard
        initialEmail="estudante@fiap.com.br"
        onSuccess={handleSuccess}
      />
    );

    const emailInput = screen.getByLabelText(/Seu e-mail/i);
    const passwordInput = screen.getByLabelText(/Sua senha/i);
    const submitBtn = screen.getByRole("button", { name: /Entrar na minha conta/i });

    fireEvent.change(emailInput, { target: { value: "estudante@fiap.com.br" } });
    fireEvent.change(passwordInput, { target: { value: "senha123456" } });
    fireEvent.click(submitBtn);

    expect(handleSuccess).toHaveBeenCalledWith({
      email: "estudante@fiap.com.br",
    });
  });
});
