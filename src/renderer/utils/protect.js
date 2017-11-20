let loggedIn = false;
const redirectUrl = '/login';

export function changeLoggedIn(value) {
    loggedIn = value;
}

export const protect = to => () => {
    if (loggedIn) {
        return to;
    } else {
        return redirectUrl;
    }
};
