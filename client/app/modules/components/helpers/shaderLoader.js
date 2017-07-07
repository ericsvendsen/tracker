(function () {
    'use strict';

    angular.module('tracker').factory('shaderLoader', function () {
        var shaderLoader = {};

        var shaderData = [
            {
                "name":"earth-fragment.glsl",
                "code":"precision mediump float;\n\nuniform vec3 uAmbientLightColor;\nuniform vec3 uDirectionalLightColor;\nuniform vec3 uLightDirection;\n\nvarying vec2 texCoord;\nvarying vec3 normal;\n\nuniform sampler2D uSampler;\nuniform sampler2D uNightSampler;\n\n\n\nvoid main(void) {\n  float directionalLightAmount = max(dot(normal, uLightDirection), 0.0);\n  vec3 lightColor = uAmbientLightColor + (uDirectionalLightColor * directionalLightAmount);\n  \n  vec3 litTexColor = texture2D(uSampler, texCoord).rgb * lightColor * 2.0;\n  \n  vec3 nightLightColor = texture2D(uNightSampler, texCoord).rgb * pow(1.0 - directionalLightAmount, 2.0) ;\n\n  gl_FragColor = vec4(litTexColor + nightLightColor, 1.0);\n}"
            },{
                "name":"earth-vertex.glsl",
                "code":"attribute vec3 aVertexPosition;\n\nattribute vec2 aTexCoord;\nattribute vec3 aVertexNormal;\n\nuniform mat4 uPMatrix;\nuniform mat4 uCamMatrix;\nuniform mat4 uMvMatrix;\nuniform mat3 uNormalMatrix;\n\n\nvarying vec2 texCoord;\nvarying vec3 normal;\nvarying float directionalLightAmount;\n\nvoid main(void) {\n  gl_Position = uPMatrix * uCamMatrix * uMvMatrix * vec4(aVertexPosition, 1.0);\n  texCoord = aTexCoord;\n  \n  normal = uNormalMatrix * aVertexNormal;\n}\n"
            },{
                "name":"dot-fragment.glsl",
                "code":"precision mediump float;\n\nvarying vec4 vColor;\n\nvoid main(void) {\n  vec2 ptCoord = gl_PointCoord * 2.0 - vec2(1.0, 1.0);\n  float r = 1.0 - min(abs(length(ptCoord)), 1.0);\n \/\/ r -= abs(ptCoord.x * ptCoord.y * 0.5);\n float alpha = pow(r + 0.1, 3.0);\n alpha = min(alpha, 1.0);\n\/\/ float alpha = r;\n  gl_FragColor = vec4(vColor.rgb, vColor.a * alpha);\n}"
            },{
                "name":"dot-vertex.glsl",
                "code":"attribute vec3 aPos;\nattribute vec4 aColor;\n\nuniform mat4 uCamMatrix;\nuniform mat4 uMvMatrix;\nuniform mat4 uPMatrix;\n\nvarying vec4 vColor;\n\nvoid main(void) {\n \/\/ gl_PointSize = 16.0;\n  vec4 position = uPMatrix * uCamMatrix *  uMvMatrix * vec4(aPos, 1.0);\n  gl_PointSize = min(max(320000.0 \/ position.w, 7.5), 20.0) * 1.0;\n  gl_Position = position;\n  vColor = aColor;\n}\n"
            },{
                "name":"pick-fragment.glsl",
                "code":"precision mediump float;\n\nvarying vec3 vColor;\n\nvoid main(void) {\n  gl_FragColor = vec4(vColor, 1.0);\n}"
            },{
                "name":"pick-vertex.glsl",
                "code":"attribute vec3 aPos;\nattribute vec3 aColor;\nattribute float aPickable;\n\nuniform mat4 uCamMatrix;\nuniform mat4 uMvMatrix;\nuniform mat4 uPMatrix;\n\nvarying vec3 vColor;\n\nvoid main(void) {\n  float dotSize = 16.0;\n  vec4 position = uPMatrix * uCamMatrix *  uMvMatrix * vec4(aPos, 1.0);\n  gl_Position = position;\n  gl_PointSize = dotSize * aPickable;\n  vColor = aColor * aPickable;\n}"
            },{
                "name":"path-fragment.glsl",
                "code":"precision mediump float;\n\nvarying vec4 vColor;\n\nvoid main(void) {\n  gl_FragColor = vColor;\n}"
            },{
                "name":"path-vertex.glsl",
                "code":"attribute vec3 aPos;\n\nuniform mat4 uCamMatrix;\nuniform mat4 uMvMatrix;\nuniform mat4 uPMatrix;\nuniform vec4 uColor;\n\nvarying vec4 vColor;\n\nvoid main(void) {\n  vec4 position = uPMatrix * uCamMatrix *  uMvMatrix * vec4(aPos, 1.0);\n  gl_Position = position;\n  vColor = uColor;\n}\n"
            }
        ];

        shaderLoader.getShaderCode = function(name) {
            for(var i=0; i<shaderData.length; i++) {
                if(shaderData[i].name === name) {
                    return shaderData[i].code;
                }
            }
            return null;
        };

        return shaderLoader;
    });
})();
