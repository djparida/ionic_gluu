import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import { RouterModule, Routes } from '@angular/router';
import { MenuController } from '@ionic/angular';
import {
  AuthorizationServiceConfigurationJson,
  AuthorizationServiceConfiguration,
  AuthorizationRequest, RedirectRequestHandler,
  FetchRequestor, LocalStorageBackend, DefaultCrypto
} from '@openid/appauth';
import {NoHashQueryStringUtils} from '../app/noHashQueryStringUtils';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public loggedIn:boolean;
  configuration: AuthorizationServiceConfigurationJson = null;
  error: any = null;
  authorizationHandler: any = null;
  accessToken: string = null;
  userInfo: any = null;
  mydata =[];
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Home',
      url: '/folder/Home',
      icon: 'home'
    },
    {
      title: 'World News',
      url: '/folder/WorldNews',
      icon: 'earth'
    },
    {
      title: 'Crime News',
      url: '/folder/CrimeNews',
      icon: 'skull'
    },
    {
      title: 'Food',
      url: '/folder/Food',
      icon: 'pizza'
    },
    {
      title: 'Health News',
      url: '/folder/Health',
      icon: 'pulse'
    },
    {
      title: 'Profile',
      url: '/folder/Profile',
      icon: 'person'
    },
    {
      title: 'Inbox',
      url: '/folder/Inbox',
      icon: 'mail'
    }
  ];
  public labels = [];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private activatedRoute: ActivatedRoute,private http: HttpClient,
    private menu: MenuController
  ) {
    this.initializeApp();
    this.authorizationHandler = new RedirectRequestHandler(new LocalStorageBackend(), new NoHashQueryStringUtils(), window.location, new DefaultCrypto());
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }

    this.accessToken = localStorage.getItem('access_token') || null;
    if (!this.accessToken) {
      this.loggedIn=false;
      return;
    }
    console.log('accessToken :- '+this.accessToken);

    this.http.get(environment.openid_connect_url + '/oxauth/restv1/userinfo', {headers: {authorization: 'Bearer ' + this.accessToken}})
    .subscribe((response) => {
      this.userInfo = response;
      this.mydata = this.userInfo;
      console.log(this.userInfo.name);
    });
    console.log('app.components is logged in or not ? '+this.loggedIn);
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
