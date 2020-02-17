import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import { MenuController } from '@ionic/angular';
import {
  AuthorizationServiceConfigurationJson,
  AuthorizationServiceConfiguration,
  AuthorizationRequest, RedirectRequestHandler,
  FetchRequestor, LocalStorageBackend, DefaultCrypto
} from '@openid/appauth';
import {NoHashQueryStringUtils} from '../noHashQueryStringUtils';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {
  configuration: AuthorizationServiceConfigurationJson = null;
  error: any = null;
  authorizationHandler: any = null;
  accessToken: string = null;

  constructor(private activatedRoute: ActivatedRoute,private http: HttpClient,private menu: MenuController) {
    this.authorizationHandler = new RedirectRequestHandler(new LocalStorageBackend(), new NoHashQueryStringUtils(), window.location, new DefaultCrypto());
   }

  ngOnInit() {
    this.accessToken = localStorage.getItem('access_token') || null;
    if (!this.accessToken) {
      return;
    }
  }
  Redirect(){
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
}
