import React from "react";
import Svg, { Circle, Line, Path, Polyline, Rect, Text as SvgText } from "react-native-svg";

const Base = ({ width = 20, children }) => (
    <Svg width={width} height={width} viewBox="0 0 24 24" fill="none">
        {children}
    </Svg>
);

const common = (color, strokeWidth = 2) => ({
    stroke: color,
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round"
});

export const UndoIcon = ({ width, color }) => (
    <Base width={width}>
        <Path {...common(color)} d="M9 7H5v4" />
        <Path {...common(color)} d="M5 11c2.2-4.2 8.1-5.4 11.7-2.2 2.7 2.4 3 6.5.7 9.2-1.7 2-4.3 2.8-6.7 2.2" />
    </Base>
);

export const RedoIcon = ({ width, color }) => (
    <Base width={width}>
        <Path {...common(color)} d="M15 7h4v4" />
        <Path {...common(color)} d="M19 11c-2.2-4.2-8.1-5.4-11.7-2.2-2.7 2.4-3 6.5-.7 9.2 1.7 2 4.3 2.8 6.7 2.2" />
    </Base>
);

export const ChevronIcon = ({ width, color }) => (
    <Base width={width}>
        <Polyline {...common(color, 2.4)} points="7 10 12 15 17 10" />
    </Base>
);

export const BoldIcon = ({ width, color }) => (
    <Base width={width}>
        <Path fill={color} d="M7 4.2h5.7c2.6 0 4.3 1.5 4.3 3.8 0 1.5-.8 2.7-2.2 3.2 1.9.5 3 1.9 3 3.9 0 2.9-2.1 4.7-5.3 4.7H7V4.2Zm3 6.1h2.1c1.2 0 1.9-.6 1.9-1.6s-.7-1.6-1.9-1.6H10v3.2Zm0 6.8h2.4c1.5 0 2.3-.7 2.3-1.9s-.8-1.9-2.3-1.9H10v3.8Z" />
    </Base>
);

export const ItalicIcon = ({ width, color }) => (
    <Base width={width}>
        <Line {...common(color, 2.4)} x1="11" y1="5" x2="17" y2="5" />
        <Line {...common(color, 2.4)} x1="7" y1="19" x2="13" y2="19" />
        <Line {...common(color, 2.4)} x1="14.5" y1="5" x2="9.5" y2="19" />
    </Base>
);

export const UnderlineIcon = ({ width, color }) => (
    <Base width={width}>
        <Path {...common(color, 2.2)} d="M7 4v6.6a5 5 0 0 0 10 0V4" />
        <Line {...common(color, 2.2)} x1="6" y1="20" x2="18" y2="20" />
    </Base>
);

export const StrikeIcon = ({ width, color }) => (
    <Base width={width}>
        <Path {...common(color, 2)} d="M17 6.2A6.3 6.3 0 0 0 12.6 5C9.8 5 8 6.2 8 8.2c0 3.8 9 2.2 9 6.7 0 2.2-2 4.1-5.1 4.1a7.4 7.4 0 0 1-5.2-2" />
        <Line {...common(color, 2)} x1="5" y1="12" x2="19" y2="12" />
    </Base>
);

export const BulletListIcon = ({ width, color }) => (
    <Base width={width}>
        <Circle fill={color} cx="6" cy="7" r="1.2" />
        <Circle fill={color} cx="6" cy="12" r="1.2" />
        <Circle fill={color} cx="6" cy="17" r="1.2" />
        <Line {...common(color, 2)} x1="10" y1="7" x2="19" y2="7" />
        <Line {...common(color, 2)} x1="10" y1="12" x2="19" y2="12" />
        <Line {...common(color, 2)} x1="10" y1="17" x2="19" y2="17" />
    </Base>
);

export const OrderedListIcon = ({ width, color }) => (
    <Base width={width}>
        <Path fill={color} d="M5.1 8.7h1.2V4.5H5.1V3.2h2.7v5.5H9v1.3H5.1V8.7Zm-.2 10.2 2.3-2.4c.5-.5.7-.9.7-1.3 0-.5-.4-.8-1-.8-.6 0-1 .3-1.4.8l-.8-.9c.6-.8 1.3-1.2 2.4-1.2 1.3 0 2.2.8 2.2 2 0 .8-.3 1.4-1.1 2.2l-1.2 1.2h2.4v1.3H4.9v-.9Z" />
        <Line {...common(color, 2)} x1="12" y1="7" x2="20" y2="7" />
        <Line {...common(color, 2)} x1="12" y1="17" x2="20" y2="17" />
    </Base>
);

export const AlignLeftIcon = ({ width, color }) => (
    <Base width={width}>
        <Line {...common(color, 2)} x1="5" y1="6" x2="19" y2="6" />
        <Line {...common(color, 2)} x1="5" y1="10" x2="15" y2="10" />
        <Line {...common(color, 2)} x1="5" y1="14" x2="19" y2="14" />
        <Line {...common(color, 2)} x1="5" y1="18" x2="14" y2="18" />
    </Base>
);

export const AlignCenterIcon = ({ width, color }) => (
    <Base width={width}>
        <Line {...common(color, 2)} x1="5" y1="6" x2="19" y2="6" />
        <Line {...common(color, 2)} x1="8" y1="10" x2="16" y2="10" />
        <Line {...common(color, 2)} x1="5" y1="14" x2="19" y2="14" />
        <Line {...common(color, 2)} x1="8" y1="18" x2="16" y2="18" />
    </Base>
);

export const AlignRightIcon = ({ width, color }) => (
    <Base width={width}>
        <Line {...common(color, 2)} x1="5" y1="6" x2="19" y2="6" />
        <Line {...common(color, 2)} x1="9" y1="10" x2="19" y2="10" />
        <Line {...common(color, 2)} x1="5" y1="14" x2="19" y2="14" />
        <Line {...common(color, 2)} x1="10" y1="18" x2="19" y2="18" />
    </Base>
);

export const LinkIcon = ({ width, color }) => (
    <Base width={width}>
        <Path {...common(color, 2)} d="M10.5 13.5a4 4 0 0 0 5.7 0l2-2a4 4 0 0 0-5.7-5.7l-1.1 1.1" />
        <Path {...common(color, 2)} d="M13.5 10.5a4 4 0 0 0-5.7 0l-2 2a4 4 0 0 0 5.7 5.7l1.1-1.1" />
    </Base>
);

export const ImageIcon = ({ width, color }) => (
    <Base width={width}>
        <Rect {...common(color, 2)} x="4" y="5" width="16" height="14" rx="2.5" />
        <Circle fill={color} cx="9" cy="10" r="1.5" />
        <Path {...common(color, 2)} d="m5 17 4.2-4.2a2 2 0 0 1 2.8 0L15 16l1.3-1.3a2 2 0 0 1 2.7-.1L20 15.5" />
    </Base>
);

export const MoreIcon = ({ width, color }) => (
    <Base width={width}>
        <Circle fill={color} cx="6" cy="12" r="1.4" />
        <Circle fill={color} cx="12" cy="12" r="1.4" />
        <Circle fill={color} cx="18" cy="12" r="1.4" />
    </Base>
);

const TextIcon = ({ width, color, text, size = 10, x = 12, y = 15 }) => (
    <Base width={width}>
        <SvgText
            x={x}
            y={y}
            fill={color}
            fontSize={size}
            fontWeight="700"
            textAnchor="middle"
        >
            {text}
        </SvgText>
    </Base>
);

export const ColorIcon = ({ width, color }) => (
    <Base width={width}>
        <SvgText x="12" y="14" fill={color} fontSize="13" fontWeight="700" textAnchor="middle">A</SvgText>
        <Line {...common(color, 2.4)} x1="7" y1="19" x2="17" y2="19" />
    </Base>
);

export const SizeIcon = ({ width, color }) => (
    <Base width={width}>
        <SvgText x="10" y="17" fill={color} fontSize="15" fontWeight="700" textAnchor="middle">T</SvgText>
        <SvgText x="17" y="17" fill={color} fontSize="10" fontWeight="700" textAnchor="middle">t</SvgText>
    </Base>
);

export const FontIcon = ({ width, color }) => <TextIcon width={width} color={color} text="F" size={15} y={17} />;
export const SupIcon = ({ width, color }) => <TextIcon width={width} color={color} text="x²" size={12} y={16} />;
export const SubIcon = ({ width, color }) => <TextIcon width={width} color={color} text="x₂" size={12} y={16} />;
export const MathIcon = ({ width, color }) => <TextIcon width={width} color={color} text="fx" size={12} y={16} />;

export const EmailIcon = ({ width, color }) => (
    <Base width={width}>
        <Rect {...common(color, 2)} x="4" y="6" width="16" height="12" rx="2" />
        <Path {...common(color, 2)} d="m5 8 7 5 7-5" />
    </Base>
);

export const QuoteIcon = ({ width, color }) => (
    <Base width={width}>
        <Path fill={color} d="M8.2 7.2c-2.1 1.2-3.2 3-3.2 5.2v4.4h5.2v-5H7.6c.1-1.1.7-2 1.8-2.7l-1.2-1.9Zm8.2 0c-2.1 1.2-3.2 3-3.2 5.2v4.4h5.2v-5h-2.6c.1-1.1.7-2 1.8-2.7l-1.2-1.9Z" />
    </Base>
);

export const CodeIcon = ({ width, color }) => (
    <Base width={width}>
        <Path {...common(color, 2.1)} d="m9 7-5 5 5 5" />
        <Path {...common(color, 2.1)} d="m15 7 5 5-5 5" />
    </Base>
);

export const TableIcon = ({ width, color }) => (
    <Base width={width}>
        <Rect {...common(color, 2)} x="4" y="5" width="16" height="14" rx="2" />
        <Line {...common(color, 2)} x1="4" y1="10" x2="20" y2="10" />
        <Line {...common(color, 2)} x1="10" y1="5" x2="10" y2="19" />
        <Line {...common(color, 2)} x1="15" y1="5" x2="15" y2="19" />
    </Base>
);

export const HrIcon = ({ width, color }) => (
    <Base width={width}>
        <Line {...common(color, 2.4)} x1="5" y1="12" x2="19" y2="12" />
    </Base>
);

export const YoutubeIcon = ({ width, color }) => (
    <Base width={width}>
        <Rect {...common(color, 2)} x="3.5" y="6.5" width="17" height="11" rx="2.5" />
        <Path fill={color} d="m11 10 4 2-4 2v-4Z" />
    </Base>
);
