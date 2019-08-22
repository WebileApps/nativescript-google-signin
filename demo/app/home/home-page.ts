import {signIn} from '@webileapps/nativescript-google-signin';
declare const com: any;
// console.log(new GoogleSignIn().message);
/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/
initGoogleSignIn();
import { NavigatedData, Page } from "tns-core-modules/ui/page";

import { HomeViewModel } from "./home-view-model";

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;

    page.bindingContext = new HomeViewModel();

}
export function initGoogleSignIn(){
    var config = {
        authCode: "112858838247-fvcm2i3nvcv39ocd1o9mdf3cblgj9mvl.apps.googleusercontent.com",
        scopes : [com.google.android.gms.common.Scopes.FITNESS_ACTIVITY_READ_WRITE,com.google.android.gms.common.Scopes.FITNESS_BODY_READ,com.google.android.gms.common.Scopes.FITNESS_LOCATION_READ],
        requestProfile: true
    };

    var callbacks = {
 
        onSuccess: ((result) => {
            console.log("onSuccess",result);
        }),
 
        onFailed: ((e)=>{
            console.log("OnFailure",e);
        })
 
    };
    signIn(config,callbacks);
  }


