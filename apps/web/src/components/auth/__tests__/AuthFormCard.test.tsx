import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthFormCard } from "../AuthFormCard";
import { HelpProvider } from "../../../context/HelpContext";

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<HelpProvider>{ui}</HelpProvider>);
};

describe("AuthFormCard Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should render login fields and trigger validation on empty submit", async () => {
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

    await waitFor(() => {
      expect(handleSuccess).not.toHaveBeenCalled();
      expect(screen.getByText(/Por favor, digite seu e-mail/i)).toBeInTheDocument();
    });
  });

  it("should block login when user is not registered", async () => {
    const handleSuccess = vi.fn();

    renderWithProviders(
      <AuthFormCard
        initialEmail="unregistered@fiap.com.br"
        onSuccess={handleSuccess}
      />
    );

    const passwordInput = screen.getByLabelText(/Sua senha/i);
    const submitBtn = screen.getByRole("button", { name: /Entrar na minha conta/i });

    fireEvent.change(passwordInput, { target: { value: "senha123456" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(handleSuccess).not.toHaveBeenCalled();
      expect(screen.getByText(/E-mail não cadastrado/i)).toBeInTheDocument();
    });
  });

  it("should submit auth successfully when valid registered credentials are provided", async () => {
    localStorage.setItem(
      "seniorease_users",
      JSON.stringify({
        "estudante@fiap.com.br": {
          name: "Estudante FIAP",
          email: "estudante@fiap.com.br",
          password: "senha123456",
        },
      })
    );

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

    await waitFor(() => {
      expect(handleSuccess).toHaveBeenCalledWith({
        name: "Estudante FIAP",
        email: "estudante@fiap.com.br",
      });
    });
  });
});
