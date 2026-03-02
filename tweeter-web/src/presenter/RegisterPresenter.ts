import { Buffer } from "buffer"
import { User, AuthToken } from "tweeter-shared"
import { UserService } from "../model.service/UserService"
import { View, Presenter } from "./Presenter"


export interface RegisterView extends View {
    setIsLoading: (value: boolean) => void
    updateUserInfo: (user: User, authToken: AuthToken, rememberMe: boolean) => void
    navigate: (value: string) => void
    setImageUrl: (value: string) => void
    setImageBytes: (value: Uint8Array) => void
    setImageFileExtension: (value: string) => void

}

export class RegisterPresenter extends Presenter<RegisterView> {
    private service: UserService;

    public constructor(view: RegisterView) {
        super(view);
        this.service = new UserService();
    }

    public async doRegister(firstName: string, lastName: string, alias: string, password: string,
    imageBytes: Uint8Array, imageFileExtension: string, rememberMe: boolean) {
        this.doFailureReportingOperation(async () => {
            this.view.setIsLoading(true);

            const [user, authToken] = await this.service.register(
                firstName,
                lastName,
                alias,
                password,
                imageBytes,
                imageFileExtension
            );

            this.view.updateUserInfo(user, authToken, rememberMe);
            this.view.navigate(`/feed/${user.alias}`);
        }, "register user")
        // finally block goes here  if there is one
        this.view.setIsLoading(false);
    };

    public getFileExtension = (file: File): string | undefined => {
        return file.name.split(".").pop();
    };

    public async handleImageFile(file: File | undefined) {

        if (file) {
        this.view.setImageUrl(URL.createObjectURL(file));

        const reader = new FileReader();
        reader.onload = (event: ProgressEvent<FileReader>) => {
            const imageStringBase64 = event.target?.result as string;

            // Remove unnecessary file metadata from the start of the string.
            const imageStringBase64BufferContents =
            imageStringBase64.split("base64,")[1];

            const bytes: Uint8Array = Buffer.from(
            imageStringBase64BufferContents,
            "base64"
            );

            this.view.setImageBytes(bytes);
        };
        reader.readAsDataURL(file);

        // Set image file extension (and move to a separate method)
        const fileExtension = this.getFileExtension(file);
        if (fileExtension) {
            this.view.setImageFileExtension(fileExtension);
        }
        } else {
            this.view.setImageUrl("");
            this.view.setImageBytes(new Uint8Array());
        }
    };

}