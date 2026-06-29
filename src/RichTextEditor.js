import React, { PureComponent, createRef } from "react";
import { View, Text, TextInput, Pressable, Platform } from "react-native";
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
    MoreIcon,
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

const getToolbarMetrics = () => ({
    horizontalPadding: setSize(28),
    buttonWidth: setSize(39),
    wideButtonWidth: setSize(133),
    dividerWidth: setSize(11),
    overflowButtonWidth: setSize(39)
});

const getToolbarItemWidth = (item, metrics) => (item.wide ? metrics.wideButtonWidth : metrics.buttonWidth);

const getToolbarItemsWidth = (items, metrics) => items.reduce((total, item, index) => {
    const previousItem = items[index - 1];
    const dividerWidth = previousItem && previousItem.groupIndex !== item.groupIndex ? metrics.dividerWidth : 0;
    return total + dividerWidth + getToolbarItemWidth(item, metrics);
}, 0);

export default class RichTextEditor extends PureComponent {
    constructor(props) {
        super(props);
        const value = limitValue(props.value || "", props.maxLength || 5000);

        this.inputRef = createRef();
        this.state = {
            value,
            selection: { start: value.length, end: value.length },
            undoStack: [],
            redoStack: [],
            toolbarWidth: 0,
            overflowOpen: false
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

    insertList = (tag) => this.insertText(`\n[${tag}]\n[*] Content\n[/${tag}]\n`);
    insertTable = () => this.insertText("\n[table]\n[tr]\n[td]\nContent\n[/td]\n[/tr]\n[/table]\n");

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
            { key: "undo", label: "", icon: UndoIcon, onPress: this.undo },
            { key: "redo", label: "", icon: RedoIcon, caret: true, onPress: this.redo }
        ],
        [
            { key: "bold", label: "", icon: BoldIcon, onPress: () => this.insertAround("[b]", "[/b]") },
            { key: "italic", label: "", icon: ItalicIcon, onPress: () => this.insertAround("[i]", "[/i]") },
            { key: "underline", label: "", icon: UnderlineIcon, onPress: () => this.insertAround("[u]", "[/u]") },
            { key: "strike", label: "", icon: StrikeIcon, onPress: () => this.insertAround("[s]", "[/s]") },
            { key: "sup", label: "", icon: SupIcon, onPress: () => this.insertAround("[sup]", "[/sup]") },
            { key: "sub", label: "", icon: SubIcon, onPress: () => this.insertAround("[sub]", "[/sub]") },
            { key: "math", label: "", icon: MathIcon, onPress: () => this.insertAround("`", "`") }
        ],
        [
            { key: "color", label: "", icon: ColorIcon, onPress: () => this.insertAround("[color=#ff0000]", "[/color]") },
            { key: "size", label: "", icon: SizeIcon, onPress: () => this.insertAround("[size=24]", "[/size]") },
            { key: "font", label: "", icon: FontIcon, onPress: () => this.insertAround("[font=Arial]", "[/font]") }
        ],
        [
            { key: "left", label: "", icon: AlignLeftIcon, onPress: () => this.insertAround("[left]", "[/left]") },
            { key: "center", label: "", icon: AlignCenterIcon, onPress: () => this.insertAround("[center]", "[/center]") },
            { key: "right", label: "", icon: AlignRightIcon, onPress: () => this.insertAround("[right]", "[/right]") },
            { key: "hr", label: "", icon: HrIcon, onPress: () => this.insertText("\n[hr]\n") }
        ],
        [
            { key: "bullet", label: "", icon: BulletListIcon, onPress: () => this.insertList("list") },
            { key: "ordered", label: "", icon: OrderedListIcon, onPress: () => this.insertList("ol") },
            { key: "quote", label: "", icon: QuoteIcon, onPress: () => this.insertAround("[quote]", "[/quote]") },
            { key: "code", label: "", icon: CodeIcon, onPress: () => this.insertAround("[code]", "[/code]") },
            { key: "table", label: "", icon: TableIcon, onPress: this.insertTable }
        ],
        [
            { key: "link", label: "", icon: LinkIcon, onPress: () => this.props.onLinkPress?.() || this.insertAround("[url=]", "[/url]") },
            { key: "email", label: "", icon: EmailIcon, onPress: () => this.insertAround("[email]", "[/email]") },
            { key: "image", label: "", icon: ImageIcon, onPress: () => this.props.onImagePress?.() || this.insertAround("[img]", "[/img]") },
            { key: "youtube", label: "", icon: YoutubeIcon, onPress: () => this.insertAround("[youtube]", "[/youtube]") }
        ]
    ];

    getToolbarItems = () => {
        const items = [];
        this.toolbarGroups().forEach((group, groupIndex) => {
            group.forEach(item => items.push({ ...item, groupIndex }));
        });
        return items;
    };

    getToolbarLayout = () => {
        const metrics = getToolbarMetrics();
        const items = this.getToolbarItems();
        const availableWidth = Math.max(0, (this.state.toolbarWidth || 0) - metrics.horizontalPadding);

        if (!this.state.toolbarWidth) return { visibleItems: items.slice(0, 2), overflowItems: items.slice(2) };
        if (getToolbarItemsWidth(items, metrics) <= availableWidth) return { visibleItems: items, overflowItems: [] };

        const visibleItems = [];
        for (let index = 0; index < items.length; index += 1) {
            const nextVisibleItems = [...visibleItems, items[index]];
            const visibleWidth = getToolbarItemsWidth(nextVisibleItems, metrics);
            const overflowDividerWidth = nextVisibleItems.length ? metrics.dividerWidth : 0;
            const reservedWidth = metrics.overflowButtonWidth + overflowDividerWidth;

            if (visibleWidth + reservedWidth > availableWidth) break;
            visibleItems.push(items[index]);
        }

        return { visibleItems, overflowItems: items.slice(visibleItems.length) };
    };

    setToolbarWidth = (event) => {
        const width = Math.round(event?.nativeEvent?.layout?.width || 0);
        if (width && Math.abs(width - this.state.toolbarWidth) > 1) this.setState({ toolbarWidth: width });
    };

    closeOverflow = () => {
        if (this.state.overflowOpen) this.setState({ overflowOpen: false });
    };

    handleToolbarPress = (item, closeOverflow = false) => {
        if (closeOverflow || this.state.overflowOpen) {
            this.setState({ overflowOpen: false }, () => item.onPress?.());
            return;
        }
        item.onPress?.();
    };

    renderDivider = (editorStyles, key) => <View key={key} style={editorStyles.divider} />;

    renderButton = (item, editorStyles, colors, options = {}) => {
        const { showLabel = false, overflow = false } = options;
        const Icon = item.icon;
        const iconColor = colors.text;
        const iconSize = item.wide || overflow ? setSize(16) : setSize(20);

        return (
            <Pressable
                key={item.key}
                accessibilityRole="button"
                accessibilityLabel={item.label || item.key}
                onPress={() => this.handleToolbarPress(item, overflow)}
                style={({ pressed }) => [
                    editorStyles.toolButton,
                    item.wide ? editorStyles.toolButtonWide : null,
                    overflow ? editorStyles.overflowMenuItem : null,
                    pressed ? editorStyles.toolButtonPressed : null
                ]}
            >
                {Icon ? <Icon width={iconSize} color={iconColor} /> : null}
                {showLabel ? (
                    <Text numberOfLines={1} style={[editorStyles.toolLabel, overflow ? editorStyles.overflowMenuLabel : null]}>
                        {item.label || item.key}
                    </Text>
                ) : null}
            </Pressable>
        );
    };

    renderToolbarItems = (items, editorStyles, colors, options = {}) => {
        const { showDividers = true } = options;

        return items.map((item, index) => (
            <React.Fragment key={`rich_text_toolbar_item_${item.key}`}>
                {showDividers && index > 0 && items[index - 1].groupIndex !== item.groupIndex
                    ? this.renderDivider(editorStyles, `rich_text_toolbar_divider_${item.groupIndex}`)
                    : null}
                {this.renderButton(item, editorStyles, colors, options)}
            </React.Fragment>
        ));
    };

    renderOverflowButton = (editorStyles, colors) => (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel="Toolkits"
            onPress={() => this.setState(prevState => ({ overflowOpen: !prevState.overflowOpen }))}
            style={({ pressed }) => [
                editorStyles.toolButton,
                this.state.overflowOpen || pressed ? editorStyles.toolButtonPressed : null
            ]}
        >
            <MoreIcon width={setSize(20)} color={colors.text} />
        </Pressable>
    );

    renderOverflowMenu = (items, editorStyles, colors) => (
        <View style={editorStyles.overflowMenu}>
            {this.renderToolbarItems(items, editorStyles, colors, { showLabel: true, overflow: true, showDividers: false })}
        </View>
    );

    renderToolbar(editorStyles, colors, toolbarStyle) {
        const { visibleItems, overflowItems } = this.getToolbarLayout();
        const hasOverflow = overflowItems.length > 0;

        return (
            <View
                onLayout={this.setToolbarWidth}
                style={[editorStyles.toolbar, toolbarStyle]}
            >
                <View style={editorStyles.toolbarContent}>
                    {this.renderToolbarItems(visibleItems, editorStyles, colors)}
                    {hasOverflow ? (
                        <React.Fragment>
                            {visibleItems.length ? this.renderDivider(editorStyles, "rich_text_toolbar_overflow_divider") : null}
                            {this.renderOverflowButton(editorStyles, colors)}
                        </React.Fragment>
                    ) : null}
                </View>
                {hasOverflow && this.state.overflowOpen ? this.renderOverflowMenu(overflowItems, editorStyles, colors) : null}
            </View>
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
            placeholder = "Input content...",
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
                    onFocus={this.closeOverflow}
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
        position: "relative",
        zIndex: 20,
        elevation: 20,
        backgroundColor: colors.toolbar,
        borderBottomWidth: setSize(1),
        borderBottomColor: colors.border,
        overflow: "visible"
    },
    toolbarContent: {
        minHeight: setSize(44),
        flexDirection: sdkStyles.flexRow,
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
    overflowMenu: {
        position: "absolute",
        top: setSize(46),
        left: setSize(8),
        right: setSize(8),
        zIndex: 30,
        elevation: 30,
        flexDirection: sdkStyles.flexRow,
        flexWrap: "wrap",
        paddingLeft: setSize(8),
        paddingRight: setSize(4),
        paddingTop: setSize(8),
        paddingBottom: setSize(4),
        backgroundColor: colors.toolbar,
        borderWidth: setSize(1),
        borderColor: colors.border,
        borderRadius: setSize(8)
    },
    overflowMenuItem: {
        flexBasis: setSize(118),
        flexGrow: 1,
        justifyContent: "flex-start",
        paddingLeft: setSize(10),
        paddingRight: setSize(10),
        marginRight: setSize(4),
        marginBottom: setSize(4)
    },
    overflowMenuLabel: {
        marginLeft: setSize(8),
        marginRight: 0
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
