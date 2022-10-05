import React from "react";
import { TextField } from "@material-ui/core";

export default function Input(props){
    const{name,label,value,varient,onChange,error=null,...other}=props;
    return(
        <TextField
        variant={varient || "outlined"}
        label={label}
        name={name}
        value={value}
        onChange={onChange}
        {...other}
        {...(error && {error:true,helperText:error})}
        />
    )
}