/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';

export enum MachineTypes {
    EDM = 'edm',
    Mill = 'mill',
    Lathe = 'lathe',
    Laser = 'laser',
    Printer = 'printer',
    Swiss = 'swiss',
}

export type MachineType = MachineTypes;

export enum SubTypes {
    Amada = 'amada',
    Brother = 'brother',
    Centroid = 'centroid',
    Citizen = 'citizen',
    Doosan = 'doosan',
    Fadal = 'fadal',
    Fanuc = 'fanuc',
    Haas = 'haas',
    Hurco = 'hurco',
    Mach3 = 'mach3',
    Mazak = 'mazak',
    Milltronics = 'milltronics',
    Mitsubishi = 'mitsubishi',
    Okuma = 'okuma',
    Tormach = 'tormach',
}

export type SubType = SubTypes;

export enum Categories {
    Motion = 'motion',
    Coordinate = 'coordinate',
    Compensation = 'compensation',
    Canned = 'canned',
    Other = 'other',
}

export type Category = Categories;

export type Parameter = {
    desc: string;
    optional: boolean;
};

export interface Parameters extends Record<string, Parameter> {
    [parameter: string]: Parameter;
}

export type Code = {
    category: Category;
    modal: boolean;
    shortDesc: string;
    desc: string;
    parameters: Parameters;
};
export interface ICode extends Record<string, Code> {
    [code: string]: Code;
}

export interface CNCCodes {
    type: 'gcode' | 'mcode';
    machineType: MachineType;
    title: string;
    codes: ICode;
}
