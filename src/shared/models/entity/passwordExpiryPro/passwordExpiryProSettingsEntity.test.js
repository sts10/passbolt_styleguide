/**
 * Passbolt ~ Open source password manager for teams
 * Copyright (c) Passbolt SA (https://www.passbolt.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Passbolt SA (https://www.passbolt.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.passbolt.com Passbolt(tm)
 * @since         4.5.0
 */

import each from "jest-each";
import EntitySchema from "passbolt-styleguide/src/shared/models/entity/abstract/entitySchema";
import EntityValidationError from "passbolt-styleguide/src/shared/models/entity/abstract/entityValidationError";
import PasswordExpiryProSettingsEntity from "./passwordExpiryProSettingsEntity";
import {defaultPasswordExpiryProSettingsDto} from "../passwordExpiry/passwordExpirySettingsEntity.test.data";

describe("passwordExpiryProSettings entity", () => {
  it("schema must validate", () => {
    EntitySchema.validateSchema(PasswordExpiryProSettingsEntity.ENTITY_NAME, PasswordExpiryProSettingsEntity.getSchema());
  });

  it("should accept a mininal valid DTO", () => {
    expect.assertions(1);
    const minmalDto = defaultPasswordExpiryProSettingsDto();

    expect(() => new PasswordExpiryProSettingsEntity(minmalDto)).not.toThrow();
  });

  it("should build an entity with default", () => {
    expect.assertions(1);

    const entity = PasswordExpiryProSettingsEntity.createFromDefault();
    expect(entity.toDto()).toStrictEqual({
      automatic_update: true,
      automatic_expiry: true,
      policy_override: false,
      expiry_notification: 2,
      default_expiry_period: 90
    });
  });

  it("should build an entity with given parameters", () => {
    expect.assertions(1);
    const expectedDto = {
      automatic_update: true,
      automatic_expiry: false,
      policy_override: true,
      expiry_notification: 5,
      default_expiry_period: 60
    };

    const entity = PasswordExpiryProSettingsEntity.createFromDefault(expectedDto);
    expect(entity.toDto()).toStrictEqual(expectedDto);
  });

  it("should throw an exception if required fields are not present", () => {
    const requiredFieldNames = PasswordExpiryProSettingsEntity.getSchema().required;
    const requiredFieldCount = 4;
    expect.assertions(requiredFieldCount * 2 + 1);

    expect(requiredFieldNames.length).toStrictEqual(requiredFieldCount);

    for (let i = 0; i < requiredFieldNames.length; i++) {
      const fieldName = requiredFieldNames[i];
      const dto = defaultPasswordExpiryProSettingsDto();
      delete dto[fieldName];
      try {
        new PasswordExpiryProSettingsEntity(dto);
      } catch (e) {
        expect(e).toBeInstanceOf(EntityValidationError);
        expect(e.hasError(fieldName, "required")).toStrictEqual(true);
      }
    }
  });

  each([
    {dto: {id: "string but not uuid"}, errorType: "format"},
    {dto: {id: -1}, errorType: "type"},

    {dto: {default_expiry_period: true}, errorType: "type"},
    {dto: {default_expiry_period: "50"}, errorType: "type"},
    {dto: {default_expiry_period: -1}, errorType: "type"},

    {dto: {policy_override: 0}, errorType: "type"},

    {dto: {automatic_update: 0}, errorType: "type"},

    {dto: {automatic_expiry: 0}, errorType: "type"},

    {dto: {expiry_notification: true}, errorType: "type"},
    {dto: {expiry_notification: "50"}, errorType: "type"},

    {dto: {created: "string but not a date"}, errorType: "format"},
    {dto: {created: -1}, errorType: "type"},

    {dto: {created_by: "string but not uuid"}, errorType: "format"},
    {dto: {created_by: -1}, errorType: "type"},

    {dto: {modified: "string but not a date"}, errorType: "format"},
    {dto: {modified: -1}, errorType: "type"},

    {dto: {modified_by: "string but not uuid"}, errorType: "format"},
    {dto: {modified_by: -1}, errorType: "type"},
  ]).describe("should throw an exception if DTO contains invalid values", scenario => {
    it(`scenario: ${JSON.stringify(scenario)}`, () => {
      expect.assertions(2);
      const fieldName = Object.keys(scenario.dto)[0];
      const erroneousDto = defaultPasswordExpiryProSettingsDto(scenario.dto);

      try {
        new PasswordExpiryProSettingsEntity(erroneousDto);
      } catch (e) {
        expect(e).toBeInstanceOf(EntityValidationError);
        expect(e.hasError(fieldName, scenario.errorType)).toStrictEqual(true);
      }
    });
  });
});
