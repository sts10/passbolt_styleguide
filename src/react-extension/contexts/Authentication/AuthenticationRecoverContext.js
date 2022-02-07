/**
 * Passbolt ~ Open source password manager for teams
 * Copyright (c) 2022 Passbolt SA (https://www.passbolt.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) 2022 Passbolt SA (https://www.passbolt.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.passbolt.com Passbolt(tm)
 * @since         3.6.0
 */
import React from "react";
import PropTypes from "prop-types";
import {withAppContext} from "../AppContext";
import {BROWSER_NAMES, detectBrowserName} from "../../../shared/lib/Browser/detectBrowserName";

// The authentication recover workflow states.
export const AuthenticationRecoverWorkflowStates = {
  CHECK_ACCOUNT_RECOVERY_EMAIL: 'Check account recovery email',
  CHOOSE_ACCOUNT_RECOVERY_SECURITY_TOKEN: 'Choose account recovery security token',
  CHOOSE_SECURITY_TOKEN: 'Choose security token',
  GENERATE_ACCOUNT_RECOVERY_GPG_KEY: 'Generate account recovery gpg key',
  HELP_CREDENTIALS_LOST: 'Help credentials lost',
  IMPORT_GPG_KEY: 'Import gpg key',
  INITIATE_ACCOUNT_RECOVERY: 'Initiate account recovery',
  INTRODUCE_EXTENSION: 'Introduce extension',
  LOADING: 'Loading',
  REQUESTING_ACCOUNT_RECOVERY: 'Requesting account recovery',
  SIGNING_IN: 'Signing in',
  UNEXPECTED_ERROR: 'Unexpected Error',
  VALIDATE_PASSPHRASE: 'Validate passphrase',
};

/**
 * The authentication recover context.
 * Handle the business logic of the recover and the manage the workflow.
 * @type {React.Context<{}>}
 */
export const AuthenticationRecoverContext = React.createContext({
  // Workflow data.
  state: null, // The recover workflow current state
  recoverInfo: null, // The recover info
  error: null, // The current error

  // Workflow mutators.
  goToImportGpgKey: () => {
  }, // Whenever the user wants to go to the import key step.
  importGpgKey: () => {
  }, // Whenever the user imports its gpg key.
  checkPassphrase: () => {
  }, // Whenever the user want to check the passphrase of its imported gpg key.
  chooseSecurityToken: () => {
  }, // Whenever the user wants to choose its security token preference.
  requestHelpCredentialsLost: () => {
  }, // Whenever the user who lost its credentials request help.
  initiateAccountRecovery: () => {
  }, // Whenever the user wants to initiate an account recovery.
  generateAccountRecoveryGpgKey: () => {
  }, // Whenever the user wants to create an account recovery gpg key.
  chooseAccountRecoverySecurityToken: () => {
  }, // Whenever the user chose its account recovery security token preferences.
});

/**
 * The authentication recover context provider.
 * Handle the business logic of the recover and the associated workflow.
 */
export class AuthenticationRecoverContextProvider extends React.Component {
  /**
   * Default constructor
   * @param props The component props
   */
  constructor(props) {
    super(props);
    this.state = this.defaultState;
  }

  /**
   * Returns the default component state
   */
  get defaultState() {
    return {
      // Workflow data.
      state: AuthenticationRecoverWorkflowStates.LOADING, // The recover workflow current state
      recoverInfo: null, // The recover info
      error: null, // The current error

      // Public workflow mutators.
      goToImportGpgKey: this.goToImportGpgKey.bind(this), // Whenever the user wants to go to the import key step.
      importGpgKey: this.importGpgKey.bind(this), // Whenever the user imports its gpg key.
      checkPassphrase: this.checkPassphrase.bind(this), // Whenever the user want to check the passphrase of its imported gpg key.
      chooseSecurityToken: this.chooseSecurityToken.bind(this), // Whenever the user wants to choose its security token preference.
      requestHelpCredentialsLost: this.requestHelpCredentialsLost.bind(this), // Whenever the user who lost its credentials request help.
      initiateAccountRecovery: this.initiateAccountRecovery.bind(this), // Whenever the user wants to initiate an account recovery.
      generateAccountRecoveryGpgKey: this.generateAccountRecoveryGpgKey.bind(this), // Whenever the user wants to create an account recovery gpg key.
      chooseAccountRecoverySecurityToken: this.chooseAccountRecoverySecurityToken.bind(this), // Whenever the user chose its account recovery security token preferences.
    };
  }

  /**
   * Whenever the component is initialized
   */
  componentDidMount() {
    this.initialize();
  }

  /**
   * Initialize the authentication recover workflow
   * @returns {Promise<void>}
   */
  async initialize() {
    const isFirstInstall = await this.props.context.port.request('passbolt.recover.first-install');
    const isChromeBrowser = detectBrowserName() === BROWSER_NAMES.CHROME;
    const recoverInfo = await this.props.context.port.request('passbolt.recover.info');
    // The user might have already set a locale, the recover info update the background page locale, refresh the locale.
    this.props.context.onRefreshLocaleRequested(recoverInfo.locale);
    // In case of error the background page should just disconnect the extension setup application.
    await this.setState({
      state: isFirstInstall && isChromeBrowser ? AuthenticationRecoverWorkflowStates.INTRODUCE_EXTENSION : AuthenticationRecoverWorkflowStates.IMPORT_GPG_KEY,
      recoverInfo
    });
  }

  /**
   * Whenever the user wants to go to the import gpg key step.
   * @returns {Promise<void>}
   */
  async goToImportGpgKey() {
    await this.setState({
      state: AuthenticationRecoverWorkflowStates.IMPORT_GPG_KEY
    });
  }

  /**
   * Whenever the user wants to import its gpg key.
   * @param {string} armoredKey The user gpg private key.
   * @returns {Promise<void>}
   * @throw {Error} If an expected errors is returned by the background page, rethrow it for the caller component.
   *  Errors of type: GpgKeyError.
   */
  async importGpgKey(armoredKey) {
    try {
      await this.props.context.port.request("passbolt.recover.import-key", armoredKey);
      await this.setState({state: AuthenticationRecoverWorkflowStates.VALIDATE_PASSPHRASE});
    } catch (error) {
      if (error.name === "GpgKeyError") {
        throw error;
      } else {
        await this.setState({state: AuthenticationRecoverWorkflowStates.UNEXPECTED_ERROR, error: error});
      }
    }
  }

  /**
   * Whenever the user imported a gpg key and wants to validate its passphrase.
   * @param {string} passphrase The user passphrase.
   * @param {boolean} rememberMe (Optional) Should the passphrase be remembered? Default false.
   * @returns {Promise<void>}
   * @throw {Error} If an expected errors is returned by the background page, rethrow it for the caller component.
   *  Errors of type: InvalidMasterPasswordError.
   */
  async checkPassphrase(passphrase, rememberMe = false) {
    try {
      await this.props.context.port.request("passbolt.recover.verify-passphrase", passphrase, rememberMe);
      await this.setState({state: AuthenticationRecoverWorkflowStates.CHOOSE_SECURITY_TOKEN});
    } catch (error) {
      if (error.name === "InvalidMasterPasswordError") {
        throw error;
      } else {
        await this.setState({state: AuthenticationRecoverWorkflowStates.UNEXPECTED_ERROR, error: error});
      }
    }
  }

  /**
   * Whenever the user chose its security token.
   * @param {Object} securityTokenDto The security token dto
   * @returns {Promise<void>}
   */
  async chooseSecurityToken(securityTokenDto) {
    try {
      await this.props.context.port.request("passbolt.recover.set-security-token", securityTokenDto);
      this.setState({state: AuthenticationRecoverWorkflowStates.SIGNING_IN});
      await this.props.context.port.request('passbolt.recover.complete');
    } catch (error) {
      await this.setState({state: AuthenticationRecoverWorkflowStates.UNEXPECTED_ERROR, error: error});
    }
  }

  /**
   * Whenever the user lost its credentials.
   * @returns {Promise<void>}
   */
  async requestHelpCredentialsLost() {
    const canRequestAccountRecoveryPolicy = this.state.recoverInfo?.user?.account_recovery_user_setting?.status === 'approved';
    if (canRequestAccountRecoveryPolicy) {
      await this.setState({state: AuthenticationRecoverWorkflowStates.INITIATE_ACCOUNT_RECOVERY});
    } else {
      await this.setState({state: AuthenticationRecoverWorkflowStates.HELP_CREDENTIALS_LOST});
    }
  }

  /**
   * Whenever the user wants to initiate the account recovery process.
   * @returns {Promise<void>}
   */
  async initiateAccountRecovery() {
    await this.setState({state: AuthenticationRecoverWorkflowStates.GENERATE_ACCOUNT_RECOVERY_GPG_KEY});
  }

  /**
   * Whenever the generation of an account recovery request gpg key is requested by the user.
   * @param {string} passphrase The passphrase used to encrypt the generated gpg key
   * @return {Promise<void>}
   */
  async generateAccountRecoveryGpgKey(passphrase) {
    const generateKeyDto = {passphrase};
    try {
      await this.props.context.port.request('passbolt.recover.generate-account-recovery-request-key', generateKeyDto);
      await this.setState({state: AuthenticationRecoverWorkflowStates.CHOOSE_ACCOUNT_RECOVERY_SECURITY_TOKEN});
    } catch (error) {
      await this.setState({state: AuthenticationRecoverWorkflowStates.UNEXPECTED_ERROR, error: error});
    }
  }

  /**
   * Whenever the user set its account recovery security token.
   * @param {Object} securityTokenDto The security token dto.
   * @returns {Promise<void>}
   */
  async chooseAccountRecoverySecurityToken(securityTokenDto) {
    try {
      await this.props.context.port.request('passbolt.recover.set-security-token', securityTokenDto);
      this.setState({state: AuthenticationRecoverWorkflowStates.REQUESTING_ACCOUNT_RECOVERY});
      await this.props.context.port.request('passbolt.recover.initiate-account-recovery-request');
      this.setState({state: AuthenticationRecoverWorkflowStates.CHECK_ACCOUNT_RECOVERY_EMAIL});
    } catch (error) {
      await this.setState({state: AuthenticationRecoverWorkflowStates.UNEXPECTED_ERROR, error: error});
    }
  }

  /**
   * Render the component
   * @returns {JSX}
   */
  render() {
    return (
      <AuthenticationRecoverContext.Provider value={this.state}>
        {this.props.children}
      </AuthenticationRecoverContext.Provider>
    );
  }
}

AuthenticationRecoverContextProvider.propTypes = {
  context: PropTypes.any, // The application context
  children: PropTypes.any // The children components
};
export default withAppContext(AuthenticationRecoverContextProvider);

/**
 * Authentication recover context consumer HOC
 * @param {React.Component} WrappedComponent The component to wrap
 */
export function withAuthenticationRecoverContext(WrappedComponent) {
  return class WithAuthenticationContext extends React.Component {
    render() {
      return (
        <AuthenticationRecoverContext.Consumer>
          {
            AuthenticationRecoverContext => <WrappedComponent
              authenticationRecoverContext={AuthenticationRecoverContext} {...this.props} />
          }
        </AuthenticationRecoverContext.Consumer>
      );
    }
  };
}
