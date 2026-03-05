import { MemoryRouter } from "react-router-dom"
import Login from "../../../../src/components/authentication/login/Login"
import { render, screen } from "@testing-library/react"
import {userEvent } from "@testing-library/user-event"
import "@testing-library/jest-dom"
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { LoginPresenter } from "../../../../src/presenter/LoginPresenter"
import { instance, mock, verify } from "@typestrong/ts-mockito"

library.add(fab);

describe("Login component", () => {

    it("starts with the sign-in button is disabled", () => {
        const { signInButton } = renderLoginAndGetElements("/");
        expect(signInButton).toBeDisabled();
    });

    it("enables the sign in button when both alias and passwords fields have text", async () => {
        const { user, signInButton, aliasField, passwordField } = renderLoginAndGetElements("/");
        await user.type(aliasField, "testAlias")
        await user.type(passwordField, "testPassword")
        expect(signInButton).toBeEnabled();
    });

    it("disables the sign in button if either the alias or password field is cleared", async () => {
        const { user, signInButton, aliasField, passwordField } = renderLoginAndGetElements("/");
        await user.type(aliasField, "testAlias")
        await user.type(passwordField, "testPassword")
        expect(signInButton).toBeEnabled();

        await user.clear(aliasField);
        expect(signInButton).toBeDisabled();

        await user.type(aliasField, "testAlias")
        expect(signInButton).toBeEnabled();

        await user.clear(passwordField);
        expect(signInButton).toBeDisabled();
    });

    it("calls the presenters Login method with correct parameters when sign in button is pressed", async () => {
        const mockPresenter = mock<LoginPresenter>();
        const mockPresenterInstance = instance(mockPresenter);

        const originalUrl = "randomUrl.com";
        const alias = "@alias";
        const password = "superSafePassword";
        const { user, signInButton, aliasField, passwordField } = renderLoginAndGetElements(originalUrl, mockPresenterInstance);

        await user.type(aliasField, alias);
        await user.type(passwordField, password);
        await user.click(signInButton);

        verify(mockPresenter.doLogin(alias, password, false, originalUrl)).once();
    });

})

function renderLogin(originalUrl: string, presenter?: LoginPresenter) {
    return render(
        <MemoryRouter>
            {!!presenter ? (<Login originalUrl={originalUrl} presenter={presenter} />) : (<Login originalUrl={originalUrl}/>) }
        </MemoryRouter>
    )
}

function renderLoginAndGetElements(originalUrl: string, presenter?: LoginPresenter) {
    const user = userEvent.setup();
    renderLogin(originalUrl, presenter);
    const signInButton = screen.getByRole("button", { name: /Sign In/i});
    const aliasField = screen.getByLabelText("alias");
    const passwordField = screen.getByLabelText("password");

    return {user, signInButton, aliasField, passwordField};
}