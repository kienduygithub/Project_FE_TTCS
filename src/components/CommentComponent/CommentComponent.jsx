import React from "react";

const CommentComponent = (props) => {
    const {dataHref, width} = props
    return (
        <div style={{marginTop: '15px', width: '100%', userSelect: 'none'}}>
            <div className="fb-comments" data-href={dataHref} data-width={width} data-numposts="5"></div>
        </div>
    )
}
export default CommentComponent