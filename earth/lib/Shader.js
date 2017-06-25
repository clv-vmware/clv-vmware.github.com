

function Shader (_vertexShader, _fragmentShader, _name, _material) {
    var _this = this;
    if (_material) {
        _this.uniforms = _material.uniforms;
        _this.attributes = _material.attributes;
    }


}