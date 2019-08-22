import {android as androidApp} from "tns-core-modules/application/application";
const androidApplication = androidApp;
let googleApiClient: any ;
const activity = androidApplication.foregroundActivity || androidApplication.startActivity;
const ACTIVITY_REQUEST_CODE = 22364;
declare const com: any;
let signInClient: any;

    function init(config) {
        if (!(googleApiClient == null || googleApiClient === undefined)) {
            return;
        }
        let authCode = getCodeFromResource("google_auth_code");
        authCode = authCode === undefined ? config.authCode : authCode;
        let tokenCode = getCodeFromResource("google_request_code");
        tokenCode = tokenCode === undefined ? config.tokenCode : tokenCode;
        if (authCode === undefined && tokenCode === undefined) {
            throw new Error("Siging Failed: authCode or requestToken is required");
        }
        let googleSignInOptionsBuilder = new com.google.android.gms.auth.api.signin.GoogleSignInOptions.Builder(com.google.android.gms.auth.api.signin.GoogleSignInOptions.DEFAULT_SIGN_IN).requestEmail();
        if ((config.scopes || []).length > 0 ) {
            let requestedScopes = config.scopes.map( scope => new com.google.android.gms.common.api.Scope(scope));
            googleSignInOptionsBuilder.requestScopes(requestedScopes[0], requestedScopes.slice(1));
        }
        if (authCode) {
            googleSignInOptionsBuilder.requestServerAuthCode(authCode);
        } else if (tokenCode) {
            googleSignInOptionsBuilder.requestServerAuthCode(tokenCode);
        }
        if (config.requestProfile) {
            googleSignInOptionsBuilder.requestProfile();
        }
        let googleSignInOptions = googleSignInOptionsBuilder.build();
        signInClient = com.google.android.gms.auth.api.signin.GoogleSignIn.getClient(androidApp.context, googleSignInOptions);
        }
    function getCodeFromResource(name) {
        const packageName = activity.getPackageName();
        const identifier = androidApplication.context.getResources().getIdentifier(name, "string", packageName);
        if (identifier === 0) {
            return undefined;
        }
        return androidApplication.context.getString(identifier);
    }
    export function signIn(config, callback) {
        try {
            init(config);
        } catch (e) {
            callback.onFailed(e);
            return;
        }
        const intent = signInClient.getSignInIntent();
        console.log(intent);
        activity.startActivityForResult(intent, ACTIVITY_REQUEST_CODE);
        activity.onActivityResult = function (requestCode, resultCode, data) {
            try {
                if (requestCode === ACTIVITY_REQUEST_CODE && resultCode === android.app.Activity.RESULT_OK) {
                    const task = com.google.android.gms.auth.api.signin.GoogleSignIn.getSignedInAccountFromIntent(data);
                    try {
                        const result = task.getResult(com.google.android.gms.common.api.ApiException.class);
                        callback.onSuccess(result.getServerAuthCode());

                    } catch (e) {
                        throw new Error("Request Cancelled");
                    }
                } else {
                    throw new Error("Request Cancelled");
                }
            } catch (e) {
                callback.onFailed(e.message);
            }
        };
    }
