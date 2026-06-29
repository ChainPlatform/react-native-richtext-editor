import React, { PureComponent, createRef } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Platform } from "react-native";
import sdkStyles, { setSize } from "@chainplatform/layout";
import {
    AlignCenterIcon,
    AlignLeftIcon,
    AlignRightIcon,
    BoldIcon,
    BulletListIcon,
    CodeIcon,
    ColorIcon,
    EmailIcon,
    FontIcon,
    HrIcon,
    ImageIcon,
    ItalicIcon,
    LinkIcon,
    MathIcon,
    OrderedListIcon,
    QuoteIcon,
    RedoIcon,
    SizeIcon,
    StrikeIcon,
    SubIcon,
    SupIcon,
    TableIcon,
    UnderlineIcon,
    UndoIcon,
    YoutubeIcon
} from "./RichTextToolbarSVG";

const DEFAULT_COLORS = {
    border: "#DFE5EC",
    text: "#0F172A",
    muted: "#64748B",
    background: "#FFFFFF",
    toolbar: "#FFFFFF",
    pressed: "#F1F5F9",
    danger: "#DC2626"
};

const nextFrame = (callback) => {
    if (typeof requestAnimationFrame === "function") return requestAnimationFrame(callback);
    return setTimeout(callback, 0);
};

const getColors = (theme = {}) => ({
    border: theme?.colors?.border || DEFAULT_COLORS.border,
    text: theme?.colors?.text || DEFAULT_COLORS.text,
    muted: theme?.colors?.text_muted || theme?.colors?.muted || DEFAULT_COLORS.muted,
    background: theme?.colors?.card || theme?.colors?.background || DEFAULT_COLORS.background,
    toolbar: theme?.colors?.card || DEFAULT_COLORS.toolbar,
    pressed: theme?.colors?.primary_soft || DEFAULT_COLORS.pressed,
    danger: theme?.colors?.error || DEFAULT_COLORS.danger
});

const limitValue = (value, maxLength) => {
    const text = value || "";
    return maxLength > 0 && text.length > maxLength ? text.slice(0, maxLength) : text;
};

export default class RichTextEditor extends PureComponent {
    constructor(props) {
        super(props);
        const value = limitValue(props.value || "", props.maxLength || 5000);

        this.inputRef = createRef();
        this.state = {
            value,
            selection: { start: value.length, end: value.length },
            undoStack: [],
            redoStack: []
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.value !== this.props.value && this.props.value !== this.state.value) {
            const value = limitValue(this.props.value || "", this.props.maxLength || 5000);
            this.setState({ value, selection: { start: value.length, end: value.length } });
        }
    }

    notifyChange = (value) => {
        this.props.onChangeText?.(value);
        this.props.onChange?.(value);
    };

    emitChange = (value, trackHistory = true) => {
        const maxLength = this.props.maxLength || 5000;
        const nextValue = limitValue(value, maxLength);

        this.setState(prevState => {
            const shouldTrack = trackHistory && prevState.value !== nextValue;
            return {
                value: nextValue,
                undoStack: shouldTrack ? [...prevState.undoStack, prevState.value].slice(-50) : prevState.undoStack,
                redoStack: shouldTrack ? [] : prevState.redoStack
            };
        });
        this.notifyChange(nextValue);
    };

    focus = () => {
        this.inputRef.current?.focus?.();
    };

    getSelectionRange = () => {
        const { value, selection } = this.state;
        const start = Math.max(0, Math.min(selection?.start ?? value.length, value.length));
        const end = Math.max(0, Math.min(selection?.end ?? value.length, value.length));
        return { start: Math.min(start, end), end: Math.max(start, end) };
    };

    setCursor = (position) => {
        nextFrame(() => {
            this.setState({ selection: { start: position, end: position } });
            this.focus();
        });
    };

    insertAround = (before, after = before) => {
        const { value } = this.state;
        const { start, end } = this.getSelectionRange();
        const selectedText = value.slice(start, end);
        const nextValue = `${value.slice(0, start)}${before}${selectedText}${after}${value.slice(end)}`;
        const nextCursor = selectedText ? start + before.length + selectedText.length + after.length : start + before.length;

        this.emitChange(nextValue);
        this.setCursor(nextCursor);
    };

    insertText = (text) => {
        const { value } = this.state;
        const { start, end } = this.getSelectionRange();
        const nextValue = `${value.slice(0, start)}${text}${value.slice(end)}`;
        const nextCursor = start + text.length;

        this.emitChange(nextValue);
        this.setCursor(nextCursor);
    };

    insertList = (tag) => this.insertText(`\n[${tag}]\n[*] Nội dung\n[/${tag}]\n`);
    insertTable = () => this.insertText("\n[table]\n[tr]\n[td]\nNội dung\n[/td]\n[/tr]\n[/table]\n");

    undo = () => {
        if (this.props.onUndo) return this.props.onUndo();
        const { undoStack, redoStack, value } = this.state;
        if (!undoStack.length) return null;

        const nextValue = undoStack[undoStack.length - 1];
        this.setState({
            value: nextValue,
            undoStack: undoStack.slice(0, -1),
            redoStack: [value, ...redoStack].slice(0, 50),
            selection: { start: nextValue.length, end: nextValue.length }
        }, () => this.notifyChange(nextValue));
    };

    redo = () => {
        if (this.props.onRedo) return this.props.onRedo();
        const { undoStack, redoStack, value } = this.state;
        if (!redoStack.length) return null;

        const nextValue = redoStack[0];
        this.setState({
            value: nextValue,
            undoStack: [...undoStack, value].slice(-50),
            redoStack: redoStack.slice(1),
            selection: { start: nextValue.length, end: nextValue.length }
        }, () => this.notifyChange(nextValue));
    };

    toolbarGroups = () => [
        [
            { key: "undo", icon: UndoIcon, onPress: this.undo },
            { key: "redo", icon: RedoIcon, caret: true, onPress: this.redo }
        ],
        [
            { key: "bold", icon: BoldIcon, onPress: () => this.insertAround("[b]", "[/b]") },
            { key: "italic", icon: ItalicIcon, onPress: () => this.insertAround("[i]", "[/i]") },
            { key: "underline", icon: UnderlineIcon, onPress: () => this.insertAround("[u]", "[/u]") },
            { key: "strike", icon: StrikeIcon, onPress: () => this.insertAround("[s]", "[/s]") },
            { key: "sup", icon: SupIcon, onPress: () => this.insertAround("[sup]", "[/sup]") },
            { key: "sub", icon: SubIcon, onPress: () => this.insertAround("[sub]", "[/sub]") },
            { key: "math", icon: MathIcon, onPress: () => this.insertAround("`", "`") }
        ],
        [
            { key: "color", icon: ColorIcon, onPress: () => this.insertAround("[color=#ff0000]", "[/color]") },
            { key: "size", icon: SizeIcon, onPress: () => this.insertAround("[size=24]", "[/size]") },
            { key: "font", icon: FontIcon, onPress: () => this.insertAround("[font=Arial]", "[/font]") }
        ],
        [
            { key: "left", icon: AlignLeftIcon, onPress: () => this.insertAround("[left]", "[/left]") },
            { key: "center", icon: AlignCenterIcon, onPress: () => this.insertAround("[center]", "[/center]") },
            { key: "right", icon: AlignRightIcon, onPress: () => this.insertAround("[right]", "[/right]") },
            { key: "hr", icon: HrIcon, onPress: () => this.insertText("\n[hr]\n") }
        ],
        [
            { key: "bullet", icon: BulletListIcon, onPress: () => this.insertList("list") },
            { key: "ordered", icon: OrderedListIcon, onPress: () => this.insertList("ol") },
            { key: "quote", icon: QuoteIcon, onPress: () => this.insertAround("[quote]", "[/quote]") },
            { key: "code", icon: CodeIcon, onPress: () => this.insertAround("[code]", "[/code]") },
            { key: "table", icon: TableIcon, onPress: this.insertTable }
        ],
        [
            { key: "link", icon: LinkIcon, onPress: () => this.props.onLinkPress?.() || this.insertAround("[url=]", "[/url]") },
            { key: "email", icon: EmailIcon, onPress: () => this.insertAround("[email]", "[/email]") },
            { key: "image", icon: ImageIcon, onPress: () => this.props.onImagePress?.() || this.insertAround("[img]", "[/img]") },
            { key: "youtube", icon: YoutubeIcon, onPress: () => this.insertAround("[youtube]", "[/youtube]") }
        ]
    ];

    renderDivider = (editorStyles, key) => <View key={key} style={editorStyles.divider} />;

    renderButton = (item, editorStyles, colors) => {
        const Icon = item.icon;
        const iconColor = colors.text;
        const iconSize = item.wide ? setSize(16) : setSize(20);

        return (
            <Pressable
                key={item.key}
                accessibilityRole="button"
                accessibilityLabel={item.label || item.key}
                onPress={item.onPress}
                style={({ pressed }) => [
                    editorStyles.toolButton,
                    item.wide ? editorStyles.toolButtonWide : null,
                    pressed ? editorStyles.toolButtonPressed : null
                ]}
            >
                {Icon ? <Icon width={iconSize} color={iconColor} /> : null}
                {item.label ? <Text numberOfLines={1} style={editorStyles.toolLabel}>{item.label}</Text> : null}
            </Pressable>
        );
    };

    renderToolbar(editorStyles, colors, toolbarStyle) {
        return (
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={editorStyles.toolbarContent}
                style={[editorStyles.toolbar, toolbarStyle]}
            >
                {this.toolbarGroups().map((group, groupIndex) => (
                    <React.Fragment key={`rich_text_toolbar_group_${groupIndex}`}>
                        {groupIndex > 0 ? this.renderDivider(editorStyles, `rich_text_toolbar_divider_${groupIndex}`) : null}
                        {group.map(item => this.renderButton(item, editorStyles, colors))}
                    </React.Fragment>
                ))}
            </ScrollView>
        );
    }

    renderCounter(editorStyles, colors, maxLength) {
        const length = this.state.value?.length || 0;
        return (
            <View style={editorStyles.counterBox}>
                <Text style={[editorStyles.counterText, length > maxLength ? { color: colors.danger } : null]}>
                    {length} / {maxLength}
                </Text>
            </View>
        );
    }

    render() {
        const {
            placeholder = "Nhập nội dung...",
            minHeight = 0,
            maxLength = 5000,
            editable = true,
            theme,
            style = null,
            containerStyle = null,
            toolbarStyle = null,
            inputStyle = null
        } = this.props;
        const colors = getColors(theme);
        const editorStyles = createEditorStyles(colors, minHeight);

        return (
            <View style={[editorStyles.wrapper, style, containerStyle]}>
                {this.renderToolbar(editorStyles, colors, toolbarStyle)}
                <TextInput
                    ref={this.inputRef}
                    value={this.state.value}
                    editable={editable}
                    multiline
                    textAlignVertical="top"
                    placeholder={placeholder}
                    placeholderTextColor={colors.muted}
                    maxLength={maxLength}
                    selection={this.state.selection}
                    onSelectionChange={(event) => this.setState({ selection: event.nativeEvent.selection })}
                    onChangeText={this.emitChange}
                    style={[
                        editorStyles.input,
                        Platform.OS === "web" ? editorStyles.webInput : null,
                        inputStyle
                    ]}
                    {...(Platform.OS === "web" ? { spellCheck: true, autoCorrect: "on" } : {})}
                />
                {this.renderCounter(editorStyles, colors, maxLength)}
            </View>
        );
    }
}

const createEditorStyles = (colors, minHeight) => ({
    wrapper: {
        position: "relative",
        backgroundColor: colors.background,
        borderWidth: setSize(1),
        borderColor: colors.border,
        borderRadius: setSize(8),
        overflow: sdkStyles.hidden
    },
    toolbar: {
        backgroundColor: colors.toolbar,
        borderBottomWidth: setSize(1),
        borderBottomColor: colors.border
    },
    toolbarContent: {
        minHeight: setSize(44),
        alignItems: sdkStyles.center,
        paddingLeft: setSize(14),
        paddingRight: setSize(14),
        paddingTop: setSize(3),
        paddingBottom: setSize(3)
    },
    divider: {
        width: setSize(1),
        height: setSize(34),
        marginLeft: setSize(5),
        marginRight: setSize(5),
        backgroundColor: colors.border
    },
    toolButton: {
        height: setSize(36),
        minWidth: setSize(36),
        paddingLeft: setSize(7),
        paddingRight: setSize(7),
        marginRight: setSize(3),
        borderRadius: setSize(6),
        alignItems: sdkStyles.center,
        justifyContent: sdkStyles.center,
        flexDirection: sdkStyles.flexRow
    },
    toolButtonWide: {
        minWidth: setSize(130),
        justifyContent: sdkStyles.spaceBetween,
        paddingLeft: setSize(10),
        paddingRight: setSize(8)
    },
    toolButtonPressed: {
        backgroundColor: colors.pressed
    },
    toolLabel: {
        flex: 1,
        minWidth: 0,
        color: colors.text,
        fontSize: setSize(13),
        lineHeight: setSize(13 * 1.4),
        fontWeight: sdkStyles.fwNormal,
        marginRight: setSize(8)
    },
    input: {
        minHeight: setSize(minHeight),
        paddingLeft: setSize(20),
        paddingRight: setSize(20),
        paddingTop: setSize(16),
        paddingBottom: setSize(38),
        color: colors.text,
        backgroundColor: colors.background,
        fontSize: setSize(13),
        lineHeight: setSize(13 * 1.4),
        fontWeight: sdkStyles.fwNormal
    },
    webInput: {
        outlineStyle: "none"
    },
    counterBox: {
        position: "absolute",
        right: setSize(16),
        bottom: setSize(8)
    },
    counterText: {
        color: colors.muted,
        fontSize: setSize(11),
        lineHeight: setSize(11 * 1.3),
        fontWeight: sdkStyles.fw600
    }
});
