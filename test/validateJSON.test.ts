/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';

import { cncCodesJSONSchema } from "@appliedengdesign/cnccodes-json-schema";
import Ajv from "ajv/dist/2020";
import { expect } from "chai";
import fs from "fs";
import path from "path";
import { CodeTypes, MachineTypes } from "../src";
import { constants } from "../src/util/constants";

const jpath = path.join(__dirname, '..', 'src', 'json');

// Load AJV
const ajv = new Ajv({ allErrors: true, verbose: true });
const validate = ajv.compile(cncCodesJSONSchema);

function _validate(type: MachineTypes | string, file: string): void {
    it(`validating ${file}`, () => {
        const data = fs.readFileSync(path.join(jpath, type, file), 'utf-8');
        const code = JSON.parse(data);
        const valid = validate(code);
        if (!valid) {
            console.error(validate.errors);
        }
        expect(valid).to.be.true;
    });
}

function _variants(type: MachineTypes | string, codeType?: CodeTypes | string): void {
    if (process.env.VARIANTS !== 'no' || process.env.VARIANTS === undefined) {
        const predicate = (f: string) => codeType === undefined || f.startsWith(codeType[0]);
        const variants = fs.readdirSync(path.join(jpath, type, 'variants')).filter(predicate);
        describe('variants...', () => {
            variants.forEach(variant => {
                if (fs.statSync(path.join(jpath, type, 'variants', variant)).isDirectory() || /^\..*/.test(variant)) {
                    return;
                }
                _validate(type, path.join('variants', variant));
            });
        });
    }
}

describe('Validating JSON...', () => {
    // Check for env TEST for specific machine type
    if (process.env.TEST) {
        const type = process.env.TEST.split(':');
        if (!Object.values<string>(MachineTypes).includes(type[0])) {
            console.error(`Invalid Machine Type: ${type[0]}`);
            return;
        } else if (type[1]) {
            // Check for specific code type
            if (!Object.values<string>(CodeTypes).includes(type[1])) {
                console.error(`Invalid Code Type: ${type[1]}`);
                return;
            }
            _validate(type[0], `${type[1][0]}${constants.jsonExt}`);
            _variants(type[0], type[1]);
        } else {
            // Validate both G / M code files for type
            Object.values(CodeTypes).forEach(codeType => {
                _validate(type[0], `${codeType[0]}${constants.jsonExt}`);
            });

            // Validate Variants for type
            _variants(type[0]);
        }
        return;
    }

    // Validate JSON for All Machine Types
    Object.values(MachineTypes).forEach(type => {
        describe(`${type}`, () => {
            Object.values(CodeTypes).forEach(codeType => {
                _validate(type, `${codeType[0]}${constants.jsonExt}`);
            });

            // Validate Variants of Machine Type
            _variants(type);
        });
    });
});
