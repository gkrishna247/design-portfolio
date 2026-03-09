// GLSL 300 es Shaders for Neural Background Particle System

export const particleVertexShader = `#version 300 es
precision mediump float;

layout(location = 0) in vec3 a_position;
layout(location = 1) in float a_size;
layout(location = 2) in vec3 a_color;
layout(location = 3) in float a_alpha;

uniform mat4 u_matrix;
uniform float u_time;
uniform float u_pixelRatio;

out vec3 v_color;
out float v_alpha;

void main() {
    v_color = a_color;
    v_alpha = a_alpha;
    
    // Subtle floating motion computed on GPU
    vec3 pos = a_position;
    pos.y += sin(u_time * 0.5 + pos.x) * 0.5;
    
    gl_Position = u_matrix * vec4(pos, 1.0);
    
    // Scale point size based on depth (perspective) and pixel ratio
    gl_PointSize = (a_size * u_pixelRatio * 300.0) / gl_Position.w;
}
`

export const particleFragmentShader = `#version 300 es
precision mediump float;

in vec3 v_color;
in float v_alpha;
out vec4 outColor;

void main() {
    // Generate soft circular gradient
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    
    if (dist > 0.5) {
        discard;
    }
    
    // Custom glowing core + chromatic edges effect
    float glow = 1.0 - (dist * 2.0);
    glow = smoothstep(0.0, 1.0, glow);
    
    vec3 finalColor = v_color * glow;
    
    outColor = vec4(finalColor, v_alpha * glow * 0.8);
}
`

export const lineVertexShader = `#version 300 es
precision mediump float;

layout(location = 0) in vec3 a_position;
layout(location = 1) in float a_alpha;

uniform mat4 u_matrix;
uniform float u_time;

out float v_alpha;

void main() {
    v_alpha = a_alpha;
    
    // Must match particle physics for connections to stay pinned
    vec3 pos = a_position;
    pos.y += sin(u_time * 0.5 + pos.x) * 0.5;
    
    gl_Position = u_matrix * vec4(pos, 1.0);
}
`

export const lineFragmentShader = `#version 300 es
precision mediump float;

in float v_alpha;
out vec4 outColor;

void main() {
    // Faint cyan-violet mix for connections
    outColor = vec4(0.5, 0.4, 1.0, v_alpha * 0.4);
}
`
