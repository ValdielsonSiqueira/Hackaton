import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { describe, it, expect, beforeEach } from "vitest";
import { ProtectedRoute } from "../ProtectedRoute";
import { AppProvider } from "../../../context/AppContext";
import { useAppStore } from "../../../store/useAppStore";

describe("ProtectedRoute Component", () => {
  beforeEach(() => {
    // Prevent initializeStore from resetting custom test state
    useAppStore.setState({
      loading: false,
      userProfile: { name: "", email: "", caregiverContact: "", isAuthenticated: false },
      initializeStore: async () => {},
    });
  });

  it("should show loading spinner when store is initializing", () => {
    useAppStore.setState({ loading: true });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <AppProvider>
          <ProtectedRoute>
            <div>Conteúdo Protegido</div>
          </ProtectedRoute>
        </AppProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Carregando SeniorEase.../i)).toBeInTheDocument();
    expect(screen.queryByText(/Conteúdo Protegido/i)).not.toBeInTheDocument();
  });

  it("should redirect unauthenticated users to /login", () => {
    useAppStore.setState({
      loading: false,
      userProfile: { name: "", email: "", caregiverContact: "", isAuthenticated: false },
    });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <AppProvider>
          <Routes>
            <Route path="/login" element={<div>Página de Login</div>} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <div>Conteúdo Protegido</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AppProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Página de Login/i)).toBeInTheDocument();
    expect(screen.queryByText(/Conteúdo Protegido/i)).not.toBeInTheDocument();
  });

  it("should render protected content when user is authenticated", () => {
    useAppStore.setState({
      loading: false,
      userProfile: { name: "Maria", email: "maria@fiap.com", caregiverContact: "", isAuthenticated: true },
    });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <AppProvider>
          <ProtectedRoute>
            <div>Conteúdo Protegido</div>
          </ProtectedRoute>
        </AppProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Conteúdo Protegido/i)).toBeInTheDocument();
  });
});
