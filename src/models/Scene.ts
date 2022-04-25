import { Model, model, prop } from "mobx-keystone";
// import { IImageLayer } from "@strategies/react-colorizer";


@model('rce/Scene')
export default class Scene extends Model({
    id: prop<string>(''),
    value: prop<number>(0),
}) {

}
