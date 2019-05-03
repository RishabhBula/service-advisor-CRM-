import React, { Component } from "react";
import Dropzone from "react-dropzone";

const CrmDragDropStyles = {
  container: {
    height: 250,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#fff",
    borderRadius: "5",
    padding: 20,
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.16)",
    cursor: "pointer"
  }
};

class CrmDragDrop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      acceptedTypes: ["image/jpg", "image/jpeg", "image/png", "image/gif"]
    };
  }

  render() {
    const { files, acceptedTypes: defaultTypes } = this.state;
    let {
      accept: acceptedTypes,
      acceptMessage,
      onFileDrop,
      isMultiple,
      containerClass
    } = this.props;
    if (!acceptedTypes) {
      acceptedTypes = defaultTypes;
    }

    return (
      <Dropzone
        onDrop={files => {
          this.setState({ files });
          onFileDrop(isMultiple ? files : files[0]);
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps()}
            className={containerClass}
            style={CrmDragDropStyles.container}
          >
            <input
              {...getInputProps()}
              accept={acceptedTypes.join(", ")}
              multiple={typeof isMultiple === undefined ? false : isMultiple}
            />
            <div className={"text-center"}>
              {files && files.length ? (
                <>
                  {`${files.length} ${files.length > 1 ? "files" : "file"}
                  selected`}
                  {files.map((file, index) => {
                    return <div key={index}>{file.name}</div>;
                  })}
                </>
              ) : (
                <>
                  <p>Drag & drop some files here, or click to select files</p>
                  <em>
                    (
                    {acceptMessage ||
                      `Only ${acceptedTypes.join(", ")} will be accepted`}
                    )
                  </em>
                </>
              )}
            </div>
          </div>
        )}
      </Dropzone>
    );
  }
}

export default CrmDragDrop;
