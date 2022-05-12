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
 * @since         3.7.0
 */
import React from "react";
import {propsWithOneErrorMessage, propsWithOneSuccessMessage} from "./DisplayActionFeedbacks.test.data";
import DisplayActionFeedbacks from "./DisplayActionFeedbacks";

export default {
  title: 'Passbolt/Common/ActionFeedback',
  component: "DisplayActionFeedbacks"
};


const Template = args => <DisplayActionFeedbacks {...args}/>;

export const Success = Template.bind({});
Success.args = propsWithOneSuccessMessage;

export const Error = Template.bind({});
Error.args = propsWithOneErrorMessage;
