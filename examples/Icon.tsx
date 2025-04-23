/*
 * This is an example React component to use with this plugin. Place this next to the IconType.ts file.
 */
import {Component} from "react";
import IconType from "./IconType";

export default class Icon extends Component<IconProperties, IconProperties> {
    constructor(props: IconProperties) {
        super(props);
        this.state = {...props};
    }

    render() {
        return <div style={{
            position: "relative",
            width: "100%",
            height: "100%",
        }} className={this.props.className}>
            <svg style={{
                width: "100%",
                height: "100%"
            }}>
                <use xlinkHref={"#" + this.state.icon}></use>
            </svg>
        </div>;
    }
}

interface IconProperties {
    icon: IconType
    className?: string
}