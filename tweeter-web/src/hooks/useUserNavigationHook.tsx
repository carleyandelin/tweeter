import { FakeData } from "tweeter-shared/dist/util/FakeData";
import { useMessageActions } from "../components/toaster/MessageHooks";
import { User } from "tweeter-shared/dist/model/domain/User";
import { AuthToken } from "tweeter-shared/dist/model/domain/AuthToken";
import { useNavigate } from "react-router-dom";
import { useUserInfo, useUserInfoActions } from "../components/userInfo/UserInfoHooks";

export const useUserNavigation = () => {
    const { displayedUser, authToken } = useUserInfo();
    const { setDisplayedUser } = useUserInfoActions();
    const navigate = useNavigate();
    const { displayErrorMessage } = useMessageActions();

    const extractAlias = (value: string): string => {
        const index = value.indexOf("@");
        return value.substring(index);
    };
      
    const getUser = async (
        authToken: AuthToken,
        alias: string
    ): Promise<User | null> => {
        // TODO: Replace with the result of calling server
        return FakeData.instance.findUserByAlias(alias);
    };

    const navigateToUser = async (event: React.MouseEvent, featureUrl: string): Promise<void> => {
        event.preventDefault();
        try {
            const alias = extractAlias(event.target.toString());
            const toUser = await getUser(authToken!, alias);
    
            if (toUser) {
            if (!toUser.equals(displayedUser!)) {
                setDisplayedUser(toUser);
                navigate(`${featureUrl}/${toUser.alias}`);
            }
            }
        } catch (error) {
            displayErrorMessage(
            `Failed to get user because of exception: ${error}`
            );
        }
    }
    return { navigateToUser };
}

// const { navigateToUser } = useUserNavigation();
// onClick={(event) => navigateToUser(event, props.featureURL)});