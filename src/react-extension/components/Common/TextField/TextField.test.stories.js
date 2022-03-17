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

export default {
  title: 'Passbolt/Common/TextField',
  component: "TextField"
};


const Template = () =>
  <div style={{display: "flex", flexWrap: "wrap"}}>
    <span style={{width: "100%", marginBottom: ".5rem"}}>TextField</span>
    <div style={{width: "24%", marginRight: "1%"}}>
      <div className="input text required">
        <label htmlFor="input1">Label</label>
        <input id="input1" type="text" placeholder='Placeholder' required="required" disabled={false}/>
      </div>
    </div>
    <div style={{width: "24%", marginRight: "1%"}}>
      <div className="input text required error">
        <label htmlFor="input4">Label</label>
        <input id="input4" type="text" placeholder='Placeholder' required="required" disabled={false}/>
        <div className="error-message">Error message</div>
      </div>
    </div>
    <div style={{width: "24%", marginRight: "1%"}}>
      <div className="input text required disabled">
        <label htmlFor="input2">Label</label>
        <input id="input2" type="text" placeholder='Placeholder' value="Value" required="required" disabled={true}/>
      </div>
    </div>
    <div style={{width: "24%", marginRight: "1%"}}>
      <div className="input text required disabled">
        <label htmlFor="input3">Label</label>
        <input id="input3" type="text" placeholder='Placeholder' required="required" disabled={true}/>
      </div>
    </div>
    <div style={{width: "24%", marginRight: "1%"}}>
      <div className="input text">
        <label htmlFor="input5">Label</label>
        <input id="input5" type="text" placeholder='Placeholder' disabled={false}/>
      </div>
    </div>
    <div style={{width: "24%", marginRight: "1%"}}>
      <div className="input text">
        <label htmlFor="input6">Label</label>
        <input id="input6" type="text" placeholder='Placeholder' disabled={false}/>
        <div className="help-message">Help message</div>
      </div>
    </div>
    <div style={{width: "24%", marginRight: "1%"}}>
      <div className="input text disabled">
        <label htmlFor="input7">Label</label>
        <input id="input7" type="text" placeholder='Placeholder' value="Value" disabled={true}/>
      </div>
    </div>
    <div style={{width: "24%", marginRight: "1%"}}>
      <div className="input text disabled">
        <label htmlFor="input8">Label</label>
        <input id="input8" type="text" placeholder='Placeholder' disabled={true}/>
        <div className="help-message">Help message</div>
      </div>
    </div>
  </div>;

export const Default = Template.bind({});
