import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import ApiOptions, { normalizeApiConfiguration } from "../ApiOptions"
import { ExtensionStateContextProvider, useExtensionState } from "@/context/ExtensionStateContext"
import { ApiConfiguration } from "@shared/api"

vi.mock("../../../context/ExtensionStateContext", async (importOriginal) => {
	const actual = await importOriginal()
	return {
		...(actual || {}),
		// your mocked methods
		useExtensionState: vi.fn(() => ({
			apiConfiguration: {
				apiProvider: "requesty",
				requestyApiKey: "",
				requestyModelId: "",
			},
			setApiConfiguration: vi.fn(),
			uriScheme: "vscode",
			requestyModels: {},
			constructorModels: {},
			isLoadingConstructorModels: false,
			setIsLoadingConstructorModels: vi.fn(),
			constructorModelsError: null,
			setConstructorModelsError: vi.fn(),
		})),
	}
})

const mockExtensionState = (apiConfiguration: Partial<ApiConfiguration>) => {
	vi.mocked(useExtensionState).mockReturnValue({
		apiConfiguration,
		setApiConfiguration: vi.fn(),
		uriScheme: "vscode",
		requestyModels: {},
		constructorModels: {},
		isLoadingConstructorModels: false,
		setIsLoadingConstructorModels: vi.fn(),
		constructorModelsError: null,
		setConstructorModelsError: vi.fn(),
	} as any)
}

describe("ApiOptions Component", () => {
	vi.clearAllMocks()
	const mockPostMessage = vi.fn()

	beforeEach(() => {
		//@ts-expect-error - vscode is not defined in the global namespace in test environment
		global.vscode = { postMessage: mockPostMessage }
		mockExtensionState({
			apiProvider: "requesty",
		})
	})

	it("renders Requesty API Key input", () => {
		render(
			<ExtensionStateContextProvider>
				<ApiOptions showModelOptions={true} />
			</ExtensionStateContextProvider>,
		)
		const apiKeyInput = screen.getByPlaceholderText("Enter API Key...")
		expect(apiKeyInput).toBeInTheDocument()
	})

	it("renders Requesty Model ID input", () => {
		render(
			<ExtensionStateContextProvider>
				<ApiOptions showModelOptions={true} />
			</ExtensionStateContextProvider>,
		)
		const modelIdInput = screen.getByPlaceholderText("Search and select a model...")
		expect(modelIdInput).toBeInTheDocument()
	})
})

describe("ApiOptions Component", () => {
	vi.clearAllMocks()
	const mockPostMessage = vi.fn()

	beforeEach(() => {
		//@ts-expect-error - vscode is not defined in the global namespace in test environment
		global.vscode = { postMessage: mockPostMessage }
		mockExtensionState({
			apiProvider: "together",
		})
	})

	it("renders Together API Key input", () => {
		render(
			<ExtensionStateContextProvider>
				<ApiOptions showModelOptions={true} />
			</ExtensionStateContextProvider>,
		)
		const apiKeyInput = screen.getByPlaceholderText("Enter API Key...")
		expect(apiKeyInput).toBeInTheDocument()
	})

	it("renders Together Model ID input", () => {
		render(
			<ExtensionStateContextProvider>
				<ApiOptions showModelOptions={true} />
			</ExtensionStateContextProvider>,
		)
		const modelIdInput = screen.getByPlaceholderText("Enter Model ID...")
		expect(modelIdInput).toBeInTheDocument()
	})
})

describe("ApiOptions Component - Constructor Models Error Handling", () => {
	vi.clearAllMocks()
	const mockPostMessage = vi.fn()

	beforeEach(() => {
		//@ts-expect-error - vscode is not defined in the global namespace in test environment
		global.vscode = { postMessage: mockPostMessage }
	})

	it("shows licence error message instead of loading for constructor provider", () => {
		vi.mocked(useExtensionState).mockReturnValue({
			apiConfiguration: {
				apiProvider: "constructory",
			},
			setApiConfiguration: vi.fn(),
			uriScheme: "vscode",
			requestyModels: {},
			constructorModels: {},
			isLoadingConstructorModels: false,
			setIsLoadingConstructorModels: vi.fn(),
			constructorModelsError: "Project owner don't have licence Research.Cline",
			setConstructorModelsError: vi.fn(),
		} as any)

		render(
			<ExtensionStateContextProvider>
				<ApiOptions showModelOptions={true} />
			</ExtensionStateContextProvider>,
		)

		expect(screen.getByText("You should have Research.Cline licence")).toBeInTheDocument()
		expect(screen.queryByText("Loading models...")).not.toBeInTheDocument()
	})

	it("shows loading message when loading and no error for constructor provider", () => {
		vi.mocked(useExtensionState).mockReturnValue({
			apiConfiguration: {
				apiProvider: "constructory",
			},
			setApiConfiguration: vi.fn(),
			uriScheme: "vscode",
			requestyModels: {},
			constructorModels: {},
			isLoadingConstructorModels: true,
			setIsLoadingConstructorModels: vi.fn(),
			constructorModelsError: null,
			setConstructorModelsError: vi.fn(),
			licensedFeatures: ["Research.Cline"],
			isLoadingLicensedFeatures: false,
		} as any)

		render(
			<ExtensionStateContextProvider>
				<ApiOptions showModelOptions={true} />
			</ExtensionStateContextProvider>,
		)

		expect(screen.getByText("Loading models...")).toBeInTheDocument()
		expect(screen.queryByText("You should have Research.Cline licence")).not.toBeInTheDocument()
	})

	it("shows generic error message for non-licence errors", () => {
		vi.mocked(useExtensionState).mockReturnValue({
			apiConfiguration: {
				apiProvider: "constructory",
			},
			setApiConfiguration: vi.fn(),
			uriScheme: "vscode",
			requestyModels: {},
			constructorModels: {},
			isLoadingConstructorModels: false,
			setIsLoadingConstructorModels: vi.fn(),
			constructorModelsError: "API Error: Network timeout",
			setConstructorModelsError: vi.fn(),
		} as any)

		render(
			<ExtensionStateContextProvider>
				<ApiOptions showModelOptions={true} />
			</ExtensionStateContextProvider>,
		)

		expect(screen.getByText("API Error: Network timeout")).toBeInTheDocument()
		expect(screen.queryByText("You should have Research.Cline licence")).not.toBeInTheDocument()
		expect(screen.queryByText("Loading models...")).not.toBeInTheDocument()
	})
})

describe("ApiOptions Component", () => {
	vi.clearAllMocks()
	const mockPostMessage = vi.fn()

	beforeEach(() => {
		//@ts-expect-error - vscode is not defined in the global namespace in test environment
		global.vscode = { postMessage: mockPostMessage }

		mockExtensionState({
			apiProvider: "fireworks",
			fireworksApiKey: "",
			fireworksModelId: "",
			fireworksModelMaxCompletionTokens: 2000,
			fireworksModelMaxTokens: 4000,
		})
	})

	it("renders Fireworks API Key input", () => {
		render(
			<ExtensionStateContextProvider>
				<ApiOptions showModelOptions={true} />
			</ExtensionStateContextProvider>,
		)
		const apiKeyInput = screen.getByPlaceholderText("Enter API Key...")
		expect(apiKeyInput).toBeInTheDocument()
	})

	it("renders Fireworks Model ID input", () => {
		render(
			<ExtensionStateContextProvider>
				<ApiOptions showModelOptions={true} />
			</ExtensionStateContextProvider>,
		)
		const modelIdInput = screen.getByPlaceholderText("Enter Model ID...")
		expect(modelIdInput).toBeInTheDocument()
	})

	it("renders Fireworks Max Completion Tokens input", () => {
		render(
			<ExtensionStateContextProvider>
				<ApiOptions showModelOptions={true} />
			</ExtensionStateContextProvider>,
		)
		const maxCompletionTokensInput = screen.getByPlaceholderText("2000")
		expect(maxCompletionTokensInput).toBeInTheDocument()
	})

	it("renders Fireworks Max Tokens input", () => {
		render(
			<ExtensionStateContextProvider>
				<ApiOptions showModelOptions={true} />
			</ExtensionStateContextProvider>,
		)
		const maxTokensInput = screen.getByPlaceholderText("4000")
		expect(maxTokensInput).toBeInTheDocument()
	})
})

describe("OpenApiInfoOptions", () => {
	const mockPostMessage = vi.fn()

	beforeEach(() => {
		vi.clearAllMocks()
		//@ts-expect-error - vscode is not defined in the global namespace in test environment
		global.vscode = { postMessage: mockPostMessage }
		mockExtensionState({
			apiProvider: "openai",
		})
	})

	it("renders OpenAI Supports Images input", () => {
		render(
			<ExtensionStateContextProvider>
				<ApiOptions showModelOptions={true} />
			</ExtensionStateContextProvider>,
		)
		fireEvent.click(screen.getByText("Model Configuration"))
		const apiKeyInput = screen.getByText("Supports Images")
		expect(apiKeyInput).toBeInTheDocument()
	})

	it("renders OpenAI Context Window Size input", () => {
		render(
			<ExtensionStateContextProvider>
				<ApiOptions showModelOptions={true} />
			</ExtensionStateContextProvider>,
		)
		fireEvent.click(screen.getByText("Model Configuration"))
		const orgIdInput = screen.getByText("Context Window Size")
		expect(orgIdInput).toBeInTheDocument()
	})

	it("renders OpenAI Max Output Tokens input", () => {
		render(
			<ExtensionStateContextProvider>
				<ApiOptions showModelOptions={true} />
			</ExtensionStateContextProvider>,
		)
		fireEvent.click(screen.getByText("Model Configuration"))
		const modelInput = screen.getByText("Max Output Tokens")
		expect(modelInput).toBeInTheDocument()
	})
})

describe("ApiOptions Component", () => {
	vi.clearAllMocks()
	const mockPostMessage = vi.fn()

	beforeEach(() => {
		//@ts-expect-error - vscode is not defined in the global namespace in test environment
		global.vscode = { postMessage: mockPostMessage }

		mockExtensionState({
			apiProvider: "nebius",
			nebiusApiKey: "",
		})
	})

	it("renders Nebius API Key input", () => {
		render(
			<ExtensionStateContextProvider>
				<ApiOptions showModelOptions={true} />
			</ExtensionStateContextProvider>,
		)
		const apiKeyInput = screen.getByPlaceholderText("Enter API Key...")
		expect(apiKeyInput).toBeInTheDocument()
	})

	it("renders Nebius Model ID select with a default model", () => {
		render(
			<ExtensionStateContextProvider>
				<ApiOptions showModelOptions={true} />
			</ExtensionStateContextProvider>,
		)
		const modelIdSelect = screen.getByLabelText("Model")
		expect(modelIdSelect).toBeInTheDocument()
		expect(modelIdSelect).toHaveValue("Qwen/Qwen2.5-32B-Instruct-fast")
	})
})

describe("ApiOptions Component - Constructory Provider", () => {
	vi.clearAllMocks()
	const mockPostMessage = vi.fn()

	beforeEach(() => {
		//@ts-expect-error - vscode is not defined in the global namespace in test environment
		global.vscode = { postMessage: mockPostMessage }
		mockExtensionState({
			apiProvider: "constructory",
			constructorModelId: "existing-model-id",
		})
	})

	it("renders constructory model dropdown", () => {
		render(
			<ExtensionStateContextProvider>
				<ApiOptions showModelOptions={true} />
			</ExtensionStateContextProvider>,
		)
		const modelSelect = screen.getByLabelText("Model")
		expect(modelSelect).toBeInTheDocument()
	})

	it("preserves selected model when constructor models are loaded", () => {
		const { container } = render(
			<ExtensionStateContextProvider>
				<ApiOptions showModelOptions={true} />
			</ExtensionStateContextProvider>,
		)

		const modelSelect = screen.getByLabelText("Model")
		expect(modelSelect).toHaveValue("existing-model-id")

		// Simulate receiving constructor models message
		const mockModels = {
			"model-1": { id: "model-1", description: "Model 1" },
			"model-2": { id: "model-2", description: "Model 2" },
		}

		// Dispatch the message event
		window.dispatchEvent(
			new MessageEvent("message", {
				data: {
					type: "constructorModels",
					constructorModels: mockModels,
				},
			}),
		)

		// The selected model should remain unchanged
		expect(modelSelect).toHaveValue("existing-model-id")
	})

	it("auto-selects constructory as default provider when license is available", () => {
		// Test with no API configuration - should default to constructory when licensed
		const result = normalizeApiConfiguration(undefined, true)
		expect(result.selectedProvider).toBe("constructory")
	})

	it("respects explicitly configured provider over auto-selection", () => {
		// Test with explicit anthropic provider - should use configured provider
		const result = normalizeApiConfiguration({ apiProvider: "anthropic" }, true)
		expect(result.selectedProvider).toBe("anthropic")
	})

	it("auto-selects constructory when no provider specified in config", () => {
		// Test with config but no provider - should default to constructory when licensed
		const result = normalizeApiConfiguration({ apiModelId: "some-model" }, true)
		expect(result.selectedProvider).toBe("constructory")
	})

	it("preserves constructory selection when explicitly chosen without license", () => {
		// Test that constructory selection is preserved even without license
		// This allows users to see the license error message in the UI
		const result = normalizeApiConfiguration({ apiProvider: "constructory" }, false)
		expect(result.selectedProvider).toBe("constructory")
	})

	it("defaults to anthropic when no provider specified and no license", () => {
		// Test that default provider is anthropic when no license is available
		const result = normalizeApiConfiguration(undefined, false)
		expect(result.selectedProvider).toBe("anthropic")
	})
})
