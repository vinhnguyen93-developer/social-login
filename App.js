import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';

GoogleSignin.configure({
  webClientId:
    '190082873884-fl1vsd72af62pvna3lf48nvj5afj0p8g.apps.googleusercontent.com',
});

const App = () => {
  const [socialLogin, setSocialLogin] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    subscriber();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loginWithGoogle = async () => {
    const {idToken} = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    try {
      let loginUser = auth().signInWithCredential(googleCredential);
      setSocialLogin(true);
    } catch (error) {
      setSocialLogin(false);
    }
  };

  const loginWithFacebook = async () => {
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);

    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw 'Something went wrong obtaining access token';
    }

    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );

    // Sign-in the user with the credential
    auth()
      .signInWithCredential(facebookCredential)
      .then(() => {
        setSocialLogin(true);
      })
      .catch(error => console.log(error));
  };

  const logout = () => {
    auth()
      .signOut()
      .then(() => {
        setSocialLogin(false);
      });
  };

  const onAuthStateChanged = user => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  return (
    <View style={styles.container}>
      {socialLogin ? (
        <View style={styles.contentContainer}>
          <Text style={styles.loginText}>Welcome!</Text>
          <TouchableOpacity
            onPress={logout}
            style={[styles.loginButton, styles.buttonFacebook]}>
            <Text style={[styles.loginButtonText, styles.textFacebook]}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.loginButtonContainer}>
          <TouchableOpacity
            onPress={loginWithGoogle}
            style={[styles.loginButton, styles.buttonGoogle]}>
            <Text style={[styles.loginButtonText, styles.textGoogle]}>
              Login with Google
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={loginWithFacebook}
            style={[styles.loginButton, styles.buttonFacebook]}>
            <Text style={[styles.loginButtonText, styles.textFacebook]}>
              Login with Facebook
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.loginButton, styles.buttonTwitter]}>
            <Text style={[styles.loginButtonText, styles.textTwitter]}>
              Login with Twitter
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
  },
  contentContainer: {
    marginTop: '30%',
  },
  loginText: {
    textAlign: 'center',
  },
  loginButtonContainer: {
    marginTop: '70%',
  },
  loginButton: {
    alignSelf: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 25,
    paddingRight: 25,
    borderRadius: 10,
    marginTop: 10,
  },
  loginButtonText: {
    fontSize: 20,
    fontWeight: '500',
  },
  buttonFacebook: {
    backgroundColor: '#e6eaf4',
  },
  textFacebook: {
    color: '#4867aa',
  },
  buttonGoogle: {
    backgroundColor: '#f5e7ea',
  },
  textGoogle: {
    color: '#de4d41',
  },
  buttonTwitter: {
    backgroundColor: '#d2e3f2',
  },
  textTwitter: {
    color: '#6fa8dc',
  },
});
