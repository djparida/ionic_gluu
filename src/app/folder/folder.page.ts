import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import { RouterModule, Routes } from '@angular/router';
import { MenuController } from '@ionic/angular';
import {
  AuthorizationServiceConfigurationJson,
  AuthorizationServiceConfiguration,
  AuthorizationRequest, RedirectRequestHandler,
  FetchRequestor, LocalStorageBackend, DefaultCrypto
} from '@openid/appauth';
import {NoHashQueryStringUtils} from '../noHashQueryStringUtils';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  loggedIn:boolean;
  val1 : any;
  configuration: AuthorizationServiceConfigurationJson = null;
  error: any = null;
  authorizationHandler: any = null;
  accessToken: string = null;
  userInfo: any = null;
  mydata =[];
  public folder: string;
  val: string;
  role : string;

  constructor(private activatedRoute: ActivatedRoute,private http: HttpClient,private menu: MenuController) {
    this.authorizationHandler = new RedirectRequestHandler(new LocalStorageBackend(), new NoHashQueryStringUtils(), window.location, new DefaultCrypto());
   }

  ngOnInit() {
    this.accessToken = localStorage.getItem('access_token') || null;
    if (!this.accessToken) {
      return;
    }
    console.log('accessToken :- '+this.accessToken);

    this.http.get(environment.openid_connect_url + '/oxauth/restv1/userinfo', {headers: {authorization: 'Bearer ' + this.accessToken}})
    .subscribe((response) => {
      this.userInfo = response;
      this.mydata = this.userInfo;
      console.log(this.userInfo.name);
      this.loggedIn = true;
      if(this.userInfo.description == 'success')
      {
        this.role = 'Viewer'
      }
      else{
        this.role = 'Viewer Plus'
      }
      console.log('role'+this.role);
    });
    
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    this.val = this.folder;
  }
  redirect() {
    AuthorizationServiceConfiguration.fetchFromIssuer(environment.openid_connect_url, new FetchRequestor())
      .then((response: any) => {
        this.configuration = response;
        const authRequest = new AuthorizationRequest({
          client_id: environment.client_id,
          redirect_uri: environment.redirect_uri,
          scope: environment.scope,
          response_type: AuthorizationRequest.RESPONSE_TYPE_CODE,
          state: undefined,
          // extras: environment.extra
        });
        this.authorizationHandler.performAuthorizationRequest(this.configuration, authRequest);
      })
      .catch(error => {
        this.error = error;
        console.log(error);
      });
  }
  signOut()
  {
    window.location.href="https://iam4.centroxy.com/oxauth/restv1/end_session?post_logout_redirect_uri=http://localhost:8100";
  }
}
