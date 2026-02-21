import { useMessageActions } from "../components/toaster/MessageHooks";
import { useNavigate } from "react-router-dom";
import { useUserInfo, useUserInfoActions } from "../components/userInfo/UserInfoHooks";
import { useRef } from "react";
import { UserNavigationView, UserNavigationPresenter } from "../presenter/UserNavigationPresenter";

export const useUserNavigation = () => {
    const { displayedUser, authToken } = useUserInfo();
    const { setDisplayedUser } = useUserInfoActions();
    const navigate = useNavigate();
    const { displayErrorMessage } = useMessageActions();

    const listener: UserNavigationView = {}
      
    const presenterRef = useRef<UserNavigationPresenter | null>(null)
        if (!presenterRef.current) { presenterRef.current = new UserNavigationPresenter(listener); }

    const navigateToUser = async (event: React.MouseEvent, featureUrl: string): Promise<void> => {
        event.preventDefault();
        try {
            const alias = presenterRef.current!.extractAlias(event.target.toString());
            const toUser = await presenterRef.current!.getUser(authToken!, alias)
    
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