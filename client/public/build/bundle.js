
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = append_empty_stylesheet(node).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    function getAllContexts() {
        return get_current_component().$$.context;
    }
    function hasContext(key) {
        return get_current_component().$$.context.has(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.0' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }
    /**
     * Base class to create strongly typed Svelte components.
     * This only exists for typing purposes and should be used in `.d.ts` files.
     *
     * ### Example:
     *
     * You have component library on npm called `component-library`, from which
     * you export a component called `MyComponent`. For Svelte+TypeScript users,
     * you want to provide typings. Therefore you create a `index.d.ts`:
     * ```ts
     * import { SvelteComponentTyped } from "svelte";
     * export class MyComponent extends SvelteComponentTyped<{foo: string}> {}
     * ```
     * Typing this makes it possible for IDEs like VS Code with the Svelte extension
     * to provide intellisense and to use the component like this in a Svelte file
     * with TypeScript:
     * ```svelte
     * <script lang="ts">
     * 	import { MyComponent } from "component-library";
     * </script>
     * <MyComponent foo={'bar'} />
     * ```
     *
     * #### Why not make this part of `SvelteComponent(Dev)`?
     * Because
     * ```ts
     * class ASubclassOfSvelteComponent extends SvelteComponent<{foo: string}> {}
     * const component: typeof SvelteComponent = ASubclassOfSvelteComponent;
     * ```
     * will throw a type error, so we need to separate the more strictly typed class.
     */
    class SvelteComponentTyped extends SvelteComponentDev {
        constructor(options) {
            super(options);
        }
    }

    var svelte = /*#__PURE__*/Object.freeze({
        __proto__: null,
        SvelteComponent: SvelteComponentDev,
        SvelteComponentTyped: SvelteComponentTyped,
        afterUpdate: afterUpdate,
        beforeUpdate: beforeUpdate,
        createEventDispatcher: createEventDispatcher,
        getAllContexts: getAllContexts,
        getContext: getContext,
        hasContext: hasContext,
        onDestroy: onDestroy,
        onMount: onMount,
        setContext: setContext,
        tick: tick
    });

    /* src/Surprise.svelte generated by Svelte v3.44.0 */

    const file$4 = "src/Surprise.svelte";

    function create_fragment$4(ctx) {
    	let p;
    	let t0;
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("🎉 ");
    			t1 = text(/*message*/ ctx[0]);
    			t2 = text(" 🍾");
    			add_location(p, file$4, 4, 0, 42);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			append_dev(p, t2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*message*/ 1) set_data_dev(t1, /*message*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Surprise', slots, []);
    	let { message } = $$props;
    	const writable_props = ['message'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Surprise> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('message' in $$props) $$invalidate(0, message = $$props.message);
    	};

    	$$self.$capture_state = () => ({ message });

    	$$self.$inject_state = $$props => {
    		if ('message' in $$props) $$invalidate(0, message = $$props.message);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [message];
    }

    class Surprise extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { message: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Surprise",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*message*/ ctx[0] === undefined && !('message' in props)) {
    			console.warn("<Surprise> was created without expected prop 'message'");
    		}
    	}

    	get message() {
    		throw new Error("<Surprise>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set message(value) {
    		throw new Error("<Surprise>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Content.svelte generated by Svelte v3.44.0 */
    const file$3 = "src/Content.svelte";

    function create_fragment$3(ctx) {
    	let p;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			p = element("p");
    			button = element("button");
    			button.textContent = "Show me a surprise!";
    			add_location(button, file$3, 11, 3, 241);
    			add_location(p, file$3, 11, 0, 238);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, button);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*showSurprise*/ ctx[0], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Content', slots, []);
    	const { open } = getContext('simple-modal');

    	const showSurprise = () => {
    		open(Surprise, { message: "It's a modal!" });
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Content> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ getContext, Surprise, open, showSurprise });
    	return [showSurprise];
    }

    class Content extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Content",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/FactItem.svelte generated by Svelte v3.44.0 */
    const file$2 = "src/FactItem.svelte";

    function create_fragment$2(ctx) {
    	let div15;
    	let div3;
    	let div1;
    	let span0;
    	let t0;
    	let div0;
    	let h30;
    	let em0;
    	let t2;
    	let p0;
    	let t4;
    	let div2;
    	let t5;
    	let div7;
    	let div5;
    	let span1;
    	let t6;
    	let div4;
    	let h31;
    	let em1;
    	let t8;
    	let p1;
    	let t10;
    	let div6;
    	let t11;
    	let div11;
    	let div9;
    	let span2;
    	let t12;
    	let div8;
    	let h32;
    	let em2;
    	let t14;
    	let p2;
    	let t16;
    	let div10;
    	let t17;
    	let div14;
    	let div13;
    	let span3;
    	let t18;
    	let div12;
    	let h33;
    	let em3;
    	let t20;
    	let p3;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div15 = element("div");
    			div3 = element("div");
    			div1 = element("div");
    			span0 = element("span");
    			t0 = space();
    			div0 = element("div");
    			h30 = element("h3");
    			em0 = element("em");
    			em0.textContent = "198";
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "Projects completed";
    			t4 = space();
    			div2 = element("div");
    			t5 = space();
    			div7 = element("div");
    			div5 = element("div");
    			span1 = element("span");
    			t6 = space();
    			div4 = element("div");
    			h31 = element("h3");
    			em1 = element("em");
    			em1.textContent = "5670";
    			t8 = space();
    			p1 = element("p");
    			p1.textContent = "Cup of coffee";
    			t10 = space();
    			div6 = element("div");
    			t11 = space();
    			div11 = element("div");
    			div9 = element("div");
    			span2 = element("span");
    			t12 = space();
    			div8 = element("div");
    			h32 = element("h3");
    			em2 = element("em");
    			em2.textContent = "427";
    			t14 = space();
    			p2 = element("p");
    			p2.textContent = "Satisfied clients";
    			t16 = space();
    			div10 = element("div");
    			t17 = space();
    			div14 = element("div");
    			div13 = element("div");
    			span3 = element("span");
    			t18 = space();
    			div12 = element("div");
    			h33 = element("h3");
    			em3 = element("em");
    			em3.textContent = "35";
    			t20 = space();
    			p3 = element("p");
    			p3.textContent = "Nominees winner";
    			attr_dev(span0, "class", "icon icon-fire");
    			add_location(span0, file$2, 16, 6, 386);
    			attr_dev(em0, "class", "count");
    			add_location(em0, file$2, 18, 37, 488);
    			attr_dev(h30, "class", "mb-0 mt-0 number");
    			add_location(h30, file$2, 18, 8, 459);
    			attr_dev(p0, "class", "mb-0");
    			add_location(p0, file$2, 19, 8, 528);
    			attr_dev(div0, "class", "details");
    			add_location(div0, file$2, 17, 6, 429);
    			attr_dev(div1, "class", "fact-item");
    			add_location(div1, file$2, 15, 4, 323);
    			attr_dev(div2, "class", "spacer d-md-none d-lg-none");
    			attr_dev(div2, "data-height", "30");
    			set_style(div2, "height", "30px");
    			add_location(div2, file$2, 22, 4, 595);
    			attr_dev(div3, "class", "col-md-3 col-sm-6");
    			add_location(div3, file$2, 13, 2, 264);
    			attr_dev(span1, "class", "icon icon-cup");
    			add_location(span1, file$2, 28, 6, 814);
    			attr_dev(em1, "class", "count");
    			add_location(em1, file$2, 30, 37, 915);
    			attr_dev(h31, "class", "mb-0 mt-0 number");
    			add_location(h31, file$2, 30, 8, 886);
    			attr_dev(p1, "class", "mb-0");
    			add_location(p1, file$2, 31, 8, 956);
    			attr_dev(div4, "class", "details");
    			add_location(div4, file$2, 29, 6, 856);
    			attr_dev(div5, "class", "fact-item");
    			add_location(div5, file$2, 27, 4, 752);
    			attr_dev(div6, "class", "spacer d-md-none d-lg-none");
    			attr_dev(div6, "data-height", "30");
    			set_style(div6, "height", "30px");
    			add_location(div6, file$2, 34, 4, 1018);
    			attr_dev(div7, "class", "col-md-3 col-sm-6");
    			add_location(div7, file$2, 25, 2, 693);
    			attr_dev(span2, "class", "icon icon-people");
    			add_location(span2, file$2, 40, 6, 1238);
    			attr_dev(em2, "class", "count");
    			add_location(em2, file$2, 42, 37, 1342);
    			attr_dev(h32, "class", "mb-0 mt-0 number");
    			add_location(h32, file$2, 42, 8, 1313);
    			attr_dev(p2, "class", "mb-0");
    			add_location(p2, file$2, 43, 8, 1382);
    			attr_dev(div8, "class", "details");
    			add_location(div8, file$2, 41, 6, 1283);
    			attr_dev(div9, "class", "fact-item");
    			add_location(div9, file$2, 39, 4, 1175);
    			attr_dev(div10, "class", "spacer d-md-none d-lg-none");
    			attr_dev(div10, "data-height", "30");
    			set_style(div10, "height", "30px");
    			add_location(div10, file$2, 46, 4, 1448);
    			attr_dev(div11, "class", "col-md-3 col-sm-6");
    			add_location(div11, file$2, 37, 2, 1116);
    			attr_dev(span3, "class", "icon icon-badge");
    			add_location(span3, file$2, 52, 6, 1668);
    			attr_dev(em3, "class", "count");
    			add_location(em3, file$2, 54, 37, 1771);
    			attr_dev(h33, "class", "mb-0 mt-0 number");
    			add_location(h33, file$2, 54, 8, 1742);
    			attr_dev(p3, "class", "mb-0");
    			add_location(p3, file$2, 55, 8, 1810);
    			attr_dev(div12, "class", "details");
    			add_location(div12, file$2, 53, 6, 1712);
    			attr_dev(div13, "class", "fact-item");
    			add_location(div13, file$2, 51, 4, 1605);
    			attr_dev(div14, "class", "col-md-3 col-sm-6");
    			add_location(div14, file$2, 49, 2, 1546);
    			attr_dev(div15, "class", "row");
    			add_location(div15, file$2, 11, 0, 243);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div15, anchor);
    			append_dev(div15, div3);
    			append_dev(div3, div1);
    			append_dev(div1, span0);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, h30);
    			append_dev(h30, em0);
    			append_dev(div0, t2);
    			append_dev(div0, p0);
    			append_dev(div3, t4);
    			append_dev(div3, div2);
    			append_dev(div15, t5);
    			append_dev(div15, div7);
    			append_dev(div7, div5);
    			append_dev(div5, span1);
    			append_dev(div5, t6);
    			append_dev(div5, div4);
    			append_dev(div4, h31);
    			append_dev(h31, em1);
    			append_dev(div4, t8);
    			append_dev(div4, p1);
    			append_dev(div7, t10);
    			append_dev(div7, div6);
    			append_dev(div15, t11);
    			append_dev(div15, div11);
    			append_dev(div11, div9);
    			append_dev(div9, span2);
    			append_dev(div9, t12);
    			append_dev(div9, div8);
    			append_dev(div8, h32);
    			append_dev(h32, em2);
    			append_dev(div8, t14);
    			append_dev(div8, p2);
    			append_dev(div11, t16);
    			append_dev(div11, div10);
    			append_dev(div15, t17);
    			append_dev(div15, div14);
    			append_dev(div14, div13);
    			append_dev(div13, span3);
    			append_dev(div13, t18);
    			append_dev(div13, div12);
    			append_dev(div12, h33);
    			append_dev(h33, em3);
    			append_dev(div12, t20);
    			append_dev(div12, p3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "click", /*showSurprise*/ ctx[0]('seven'), false, false, false),
    					listen_dev(div5, "click", /*showSurprise*/ ctx[0]('amit'), false, false, false),
    					listen_dev(div9, "click", /*showSurprise*/ ctx[0]('alice'), false, false, false),
    					listen_dev(div13, "click", /*showSurprise*/ ctx[0]('sunil'), false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div15);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FactItem', slots, []);
    	const { open } = getContext('simple-modal');

    	const showSurprise = content => () => {
    		open(Surprise, { message: content });
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FactItem> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ getContext, Surprise, open, showSurprise });
    	return [showSurprise];
    }

    class FactItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FactItem",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    /* node_modules/svelte-simple-modal/src/Modal.svelte generated by Svelte v3.44.0 */

    const { Object: Object_1, window: window_1 } = globals;
    const file$1 = "node_modules/svelte-simple-modal/src/Modal.svelte";

    // (338:0) {#if Component}
    function create_if_block(ctx) {
    	let div3;
    	let div2;
    	let div1;
    	let t;
    	let div0;
    	let switch_instance;
    	let div1_transition;
    	let div3_transition;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*state*/ ctx[0].closeButton && create_if_block_1(ctx);
    	var switch_value = /*Component*/ ctx[1];

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			div0 = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			attr_dev(div0, "class", "content svelte-2wx9ab");
    			attr_dev(div0, "style", /*cssContent*/ ctx[8]);
    			add_location(div0, file$1, 366, 8, 8864);
    			attr_dev(div1, "class", "window svelte-2wx9ab");
    			attr_dev(div1, "role", "dialog");
    			attr_dev(div1, "aria-modal", "true");
    			attr_dev(div1, "style", /*cssWindow*/ ctx[7]);
    			add_location(div1, file$1, 347, 6, 8239);
    			attr_dev(div2, "class", "window-wrap svelte-2wx9ab");
    			attr_dev(div2, "style", /*cssWindowWrap*/ ctx[6]);
    			add_location(div2, file$1, 346, 4, 8168);
    			attr_dev(div3, "class", "bg svelte-2wx9ab");
    			attr_dev(div3, "style", /*cssBg*/ ctx[5]);
    			add_location(div3, file$1, 338, 2, 7958);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			if (if_block) if_block.m(div1, null);
    			append_dev(div1, t);
    			append_dev(div1, div0);

    			if (switch_instance) {
    				mount_component(switch_instance, div0, null);
    			}

    			/*div1_binding*/ ctx[39](div1);
    			/*div2_binding*/ ctx[40](div2);
    			/*div3_binding*/ ctx[41](div3);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						div1,
    						"introstart",
    						function () {
    							if (is_function(/*onOpen*/ ctx[12])) /*onOpen*/ ctx[12].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div1,
    						"outrostart",
    						function () {
    							if (is_function(/*onClose*/ ctx[13])) /*onClose*/ ctx[13].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div1,
    						"introend",
    						function () {
    							if (is_function(/*onOpened*/ ctx[14])) /*onOpened*/ ctx[14].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div1,
    						"outroend",
    						function () {
    							if (is_function(/*onClosed*/ ctx[15])) /*onClosed*/ ctx[15].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(div3, "mousedown", /*handleOuterMousedown*/ ctx[19], false, false, false),
    					listen_dev(div3, "mouseup", /*handleOuterMouseup*/ ctx[20], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*state*/ ctx[0].closeButton) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*state*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div1, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (switch_value !== (switch_value = /*Component*/ ctx[1])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div0, null);
    				} else {
    					switch_instance = null;
    				}
    			}

    			if (!current || dirty[0] & /*cssContent*/ 256) {
    				attr_dev(div0, "style", /*cssContent*/ ctx[8]);
    			}

    			if (!current || dirty[0] & /*cssWindow*/ 128) {
    				attr_dev(div1, "style", /*cssWindow*/ ctx[7]);
    			}

    			if (!current || dirty[0] & /*cssWindowWrap*/ 64) {
    				attr_dev(div2, "style", /*cssWindowWrap*/ ctx[6]);
    			}

    			if (!current || dirty[0] & /*cssBg*/ 32) {
    				attr_dev(div3, "style", /*cssBg*/ ctx[5]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div1_transition) div1_transition = create_bidirectional_transition(div1, /*currentTransitionWindow*/ ctx[11], /*state*/ ctx[0].transitionWindowProps, true);
    				div1_transition.run(1);
    			});

    			add_render_callback(() => {
    				if (!div3_transition) div3_transition = create_bidirectional_transition(div3, /*currentTransitionBg*/ ctx[10], /*state*/ ctx[0].transitionBgProps, true);
    				div3_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			if (!div1_transition) div1_transition = create_bidirectional_transition(div1, /*currentTransitionWindow*/ ctx[11], /*state*/ ctx[0].transitionWindowProps, false);
    			div1_transition.run(0);
    			if (!div3_transition) div3_transition = create_bidirectional_transition(div3, /*currentTransitionBg*/ ctx[10], /*state*/ ctx[0].transitionBgProps, false);
    			div3_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (if_block) if_block.d();
    			if (switch_instance) destroy_component(switch_instance);
    			/*div1_binding*/ ctx[39](null);
    			if (detaching && div1_transition) div1_transition.end();
    			/*div2_binding*/ ctx[40](null);
    			/*div3_binding*/ ctx[41](null);
    			if (detaching && div3_transition) div3_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(338:0) {#if Component}",
    		ctx
    	});

    	return block;
    }

    // (360:8) {#if state.closeButton}
    function create_if_block_1(ctx) {
    	let show_if;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (show_if == null || dirty[0] & /*state*/ 1) show_if = !!/*isFunction*/ ctx[16](/*state*/ ctx[0].closeButton);
    		if (show_if) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx, [-1, -1]);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx, dirty);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(360:8) {#if state.closeButton}",
    		ctx
    	});

    	return block;
    }

    // (363:10) {:else}
    function create_else_block(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "class", "close svelte-2wx9ab");
    			attr_dev(button, "style", /*cssCloseButton*/ ctx[9]);
    			add_location(button, file$1, 363, 12, 8761);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*close*/ ctx[17], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*cssCloseButton*/ 512) {
    				attr_dev(button, "style", /*cssCloseButton*/ ctx[9]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(363:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (361:10) {#if isFunction(state.closeButton)}
    function create_if_block_2(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*state*/ ctx[0].closeButton;

    	function switch_props(ctx) {
    		return {
    			props: { onClose: /*close*/ ctx[17] },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (switch_value !== (switch_value = /*state*/ ctx[0].closeButton)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(361:10) {#if isFunction(state.closeButton)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*Component*/ ctx[1] && create_if_block(ctx);
    	const default_slot_template = /*#slots*/ ctx[38].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[37], null);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window_1, "keydown", /*handleKeydown*/ ctx[18], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*Component*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*Component*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t.parentNode, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[1] & /*$$scope*/ 64)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[37],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[37])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[37], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function bind(Component, props = {}) {
    	return function ModalComponent(options) {
    		return new Component({
    				...options,
    				props: { ...props, ...options.props }
    			});
    	};
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Modal', slots, ['default']);
    	const dispatch = createEventDispatcher();
    	const baseSetContext = setContext;
    	let { show = null } = $$props;
    	let { key = 'simple-modal' } = $$props;
    	let { closeButton = true } = $$props;
    	let { closeOnEsc = true } = $$props;
    	let { closeOnOuterClick = true } = $$props;
    	let { styleBg = {} } = $$props;
    	let { styleWindowWrap = {} } = $$props;
    	let { styleWindow = {} } = $$props;
    	let { styleContent = {} } = $$props;
    	let { styleCloseButton = {} } = $$props;
    	let { setContext: setContext$1 = baseSetContext } = $$props;
    	let { transitionBg = fade } = $$props;
    	let { transitionBgProps = { duration: 250 } } = $$props;
    	let { transitionWindow = transitionBg } = $$props;
    	let { transitionWindowProps = transitionBgProps } = $$props;

    	const defaultState = {
    		closeButton,
    		closeOnEsc,
    		closeOnOuterClick,
    		styleBg,
    		styleWindowWrap,
    		styleWindow,
    		styleContent,
    		styleCloseButton,
    		transitionBg,
    		transitionBgProps,
    		transitionWindow,
    		transitionWindowProps
    	};

    	let state = { ...defaultState };
    	let Component = null;
    	let background;
    	let wrap;
    	let modalWindow;
    	let scrollY;
    	let cssBg;
    	let cssWindowWrap;
    	let cssWindow;
    	let cssContent;
    	let cssCloseButton;
    	let currentTransitionBg;
    	let currentTransitionWindow;
    	let prevBodyPosition;
    	let prevBodyOverflow;
    	let prevBodyWidth;
    	let outerClickTarget;
    	const camelCaseToDash = str => str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();

    	const toCssString = props => props
    	? Object.keys(props).reduce((str, key) => `${str}; ${camelCaseToDash(key)}: ${props[key]}`, '')
    	: '';

    	const isFunction = f => !!(f && f.constructor && f.call && f.apply);

    	const updateStyleTransition = () => {
    		$$invalidate(5, cssBg = toCssString(Object.assign(
    			{},
    			{
    				width: window.innerWidth,
    				height: window.innerHeight
    			},
    			state.styleBg
    		)));

    		$$invalidate(6, cssWindowWrap = toCssString(state.styleWindowWrap));
    		$$invalidate(7, cssWindow = toCssString(state.styleWindow));
    		$$invalidate(8, cssContent = toCssString(state.styleContent));
    		$$invalidate(9, cssCloseButton = toCssString(state.styleCloseButton));
    		$$invalidate(10, currentTransitionBg = state.transitionBg);
    		$$invalidate(11, currentTransitionWindow = state.transitionWindow);
    	};

    	const toVoid = () => {
    		
    	};

    	let onOpen = toVoid;
    	let onClose = toVoid;
    	let onOpened = toVoid;
    	let onClosed = toVoid;

    	const open = (NewComponent, newProps = {}, options = {}, callback = {}) => {
    		$$invalidate(1, Component = bind(NewComponent, newProps));
    		$$invalidate(0, state = { ...defaultState, ...options });
    		updateStyleTransition();
    		disableScroll();

    		($$invalidate(12, onOpen = event => {
    			if (callback.onOpen) callback.onOpen(event);
    			dispatch('open');
    			dispatch('opening'); // Deprecated. Do not use!
    		}), $$invalidate(13, onClose = event => {
    			if (callback.onClose) callback.onClose(event);
    			dispatch('close');
    			dispatch('closing'); // Deprecated. Do not use!
    		}), $$invalidate(14, onOpened = event => {
    			if (callback.onOpened) callback.onOpened(event);
    			dispatch('opened');
    		}));

    		$$invalidate(15, onClosed = event => {
    			if (callback.onClosed) callback.onClosed(event);
    			dispatch('closed');
    		});
    	};

    	const close = (callback = {}) => {
    		$$invalidate(13, onClose = callback.onClose || onClose);
    		$$invalidate(15, onClosed = callback.onClosed || onClosed);
    		$$invalidate(1, Component = null);
    		enableScroll();
    	};

    	const handleKeydown = event => {
    		if (state.closeOnEsc && Component && event.key === 'Escape') {
    			event.preventDefault();
    			close();
    		}

    		if (Component && event.key === 'Tab') {
    			// trap focus
    			const nodes = modalWindow.querySelectorAll('*');

    			const tabbable = Array.from(nodes).filter(node => node.tabIndex >= 0);
    			let index = tabbable.indexOf(document.activeElement);
    			if (index === -1 && event.shiftKey) index = 0;
    			index += tabbable.length + (event.shiftKey ? -1 : 1);
    			index %= tabbable.length;
    			tabbable[index].focus();
    			event.preventDefault();
    		}
    	};

    	const handleOuterMousedown = event => {
    		if (state.closeOnOuterClick && (event.target === background || event.target === wrap)) outerClickTarget = event.target;
    	};

    	const handleOuterMouseup = event => {
    		if (state.closeOnOuterClick && event.target === outerClickTarget) {
    			event.preventDefault();
    			close();
    		}
    	};

    	const disableScroll = () => {
    		scrollY = window.scrollY;
    		prevBodyPosition = document.body.style.position;
    		prevBodyOverflow = document.body.style.overflow;
    		prevBodyWidth = document.body.style.width;
    		document.body.style.position = 'fixed';
    		document.body.style.top = `-${scrollY}px`;
    		document.body.style.overflow = 'hidden';
    		document.body.style.width = '100%';
    	};

    	const enableScroll = () => {
    		document.body.style.position = prevBodyPosition || '';
    		document.body.style.top = '';
    		document.body.style.overflow = prevBodyOverflow || '';
    		document.body.style.width = prevBodyWidth || '';
    		window.scrollTo(0, scrollY);
    	};

    	setContext$1(key, { open, close });
    	let isMounted = false;

    	onDestroy(() => {
    		if (isMounted) close();
    	});

    	onMount(() => {
    		$$invalidate(36, isMounted = true);
    	});

    	const writable_props = [
    		'show',
    		'key',
    		'closeButton',
    		'closeOnEsc',
    		'closeOnOuterClick',
    		'styleBg',
    		'styleWindowWrap',
    		'styleWindow',
    		'styleContent',
    		'styleCloseButton',
    		'setContext',
    		'transitionBg',
    		'transitionBgProps',
    		'transitionWindow',
    		'transitionWindowProps'
    	];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Modal> was created with unknown prop '${key}'`);
    	});

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			modalWindow = $$value;
    			$$invalidate(4, modalWindow);
    		});
    	}

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			wrap = $$value;
    			$$invalidate(3, wrap);
    		});
    	}

    	function div3_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			background = $$value;
    			$$invalidate(2, background);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('show' in $$props) $$invalidate(21, show = $$props.show);
    		if ('key' in $$props) $$invalidate(22, key = $$props.key);
    		if ('closeButton' in $$props) $$invalidate(23, closeButton = $$props.closeButton);
    		if ('closeOnEsc' in $$props) $$invalidate(24, closeOnEsc = $$props.closeOnEsc);
    		if ('closeOnOuterClick' in $$props) $$invalidate(25, closeOnOuterClick = $$props.closeOnOuterClick);
    		if ('styleBg' in $$props) $$invalidate(26, styleBg = $$props.styleBg);
    		if ('styleWindowWrap' in $$props) $$invalidate(27, styleWindowWrap = $$props.styleWindowWrap);
    		if ('styleWindow' in $$props) $$invalidate(28, styleWindow = $$props.styleWindow);
    		if ('styleContent' in $$props) $$invalidate(29, styleContent = $$props.styleContent);
    		if ('styleCloseButton' in $$props) $$invalidate(30, styleCloseButton = $$props.styleCloseButton);
    		if ('setContext' in $$props) $$invalidate(31, setContext$1 = $$props.setContext);
    		if ('transitionBg' in $$props) $$invalidate(32, transitionBg = $$props.transitionBg);
    		if ('transitionBgProps' in $$props) $$invalidate(33, transitionBgProps = $$props.transitionBgProps);
    		if ('transitionWindow' in $$props) $$invalidate(34, transitionWindow = $$props.transitionWindow);
    		if ('transitionWindowProps' in $$props) $$invalidate(35, transitionWindowProps = $$props.transitionWindowProps);
    		if ('$$scope' in $$props) $$invalidate(37, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		bind,
    		svelte,
    		fade,
    		createEventDispatcher,
    		dispatch,
    		baseSetContext,
    		show,
    		key,
    		closeButton,
    		closeOnEsc,
    		closeOnOuterClick,
    		styleBg,
    		styleWindowWrap,
    		styleWindow,
    		styleContent,
    		styleCloseButton,
    		setContext: setContext$1,
    		transitionBg,
    		transitionBgProps,
    		transitionWindow,
    		transitionWindowProps,
    		defaultState,
    		state,
    		Component,
    		background,
    		wrap,
    		modalWindow,
    		scrollY,
    		cssBg,
    		cssWindowWrap,
    		cssWindow,
    		cssContent,
    		cssCloseButton,
    		currentTransitionBg,
    		currentTransitionWindow,
    		prevBodyPosition,
    		prevBodyOverflow,
    		prevBodyWidth,
    		outerClickTarget,
    		camelCaseToDash,
    		toCssString,
    		isFunction,
    		updateStyleTransition,
    		toVoid,
    		onOpen,
    		onClose,
    		onOpened,
    		onClosed,
    		open,
    		close,
    		handleKeydown,
    		handleOuterMousedown,
    		handleOuterMouseup,
    		disableScroll,
    		enableScroll,
    		isMounted
    	});

    	$$self.$inject_state = $$props => {
    		if ('show' in $$props) $$invalidate(21, show = $$props.show);
    		if ('key' in $$props) $$invalidate(22, key = $$props.key);
    		if ('closeButton' in $$props) $$invalidate(23, closeButton = $$props.closeButton);
    		if ('closeOnEsc' in $$props) $$invalidate(24, closeOnEsc = $$props.closeOnEsc);
    		if ('closeOnOuterClick' in $$props) $$invalidate(25, closeOnOuterClick = $$props.closeOnOuterClick);
    		if ('styleBg' in $$props) $$invalidate(26, styleBg = $$props.styleBg);
    		if ('styleWindowWrap' in $$props) $$invalidate(27, styleWindowWrap = $$props.styleWindowWrap);
    		if ('styleWindow' in $$props) $$invalidate(28, styleWindow = $$props.styleWindow);
    		if ('styleContent' in $$props) $$invalidate(29, styleContent = $$props.styleContent);
    		if ('styleCloseButton' in $$props) $$invalidate(30, styleCloseButton = $$props.styleCloseButton);
    		if ('setContext' in $$props) $$invalidate(31, setContext$1 = $$props.setContext);
    		if ('transitionBg' in $$props) $$invalidate(32, transitionBg = $$props.transitionBg);
    		if ('transitionBgProps' in $$props) $$invalidate(33, transitionBgProps = $$props.transitionBgProps);
    		if ('transitionWindow' in $$props) $$invalidate(34, transitionWindow = $$props.transitionWindow);
    		if ('transitionWindowProps' in $$props) $$invalidate(35, transitionWindowProps = $$props.transitionWindowProps);
    		if ('state' in $$props) $$invalidate(0, state = $$props.state);
    		if ('Component' in $$props) $$invalidate(1, Component = $$props.Component);
    		if ('background' in $$props) $$invalidate(2, background = $$props.background);
    		if ('wrap' in $$props) $$invalidate(3, wrap = $$props.wrap);
    		if ('modalWindow' in $$props) $$invalidate(4, modalWindow = $$props.modalWindow);
    		if ('scrollY' in $$props) scrollY = $$props.scrollY;
    		if ('cssBg' in $$props) $$invalidate(5, cssBg = $$props.cssBg);
    		if ('cssWindowWrap' in $$props) $$invalidate(6, cssWindowWrap = $$props.cssWindowWrap);
    		if ('cssWindow' in $$props) $$invalidate(7, cssWindow = $$props.cssWindow);
    		if ('cssContent' in $$props) $$invalidate(8, cssContent = $$props.cssContent);
    		if ('cssCloseButton' in $$props) $$invalidate(9, cssCloseButton = $$props.cssCloseButton);
    		if ('currentTransitionBg' in $$props) $$invalidate(10, currentTransitionBg = $$props.currentTransitionBg);
    		if ('currentTransitionWindow' in $$props) $$invalidate(11, currentTransitionWindow = $$props.currentTransitionWindow);
    		if ('prevBodyPosition' in $$props) prevBodyPosition = $$props.prevBodyPosition;
    		if ('prevBodyOverflow' in $$props) prevBodyOverflow = $$props.prevBodyOverflow;
    		if ('prevBodyWidth' in $$props) prevBodyWidth = $$props.prevBodyWidth;
    		if ('outerClickTarget' in $$props) outerClickTarget = $$props.outerClickTarget;
    		if ('onOpen' in $$props) $$invalidate(12, onOpen = $$props.onOpen);
    		if ('onClose' in $$props) $$invalidate(13, onClose = $$props.onClose);
    		if ('onOpened' in $$props) $$invalidate(14, onOpened = $$props.onOpened);
    		if ('onClosed' in $$props) $$invalidate(15, onClosed = $$props.onClosed);
    		if ('isMounted' in $$props) $$invalidate(36, isMounted = $$props.isMounted);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*show*/ 2097152 | $$self.$$.dirty[1] & /*isMounted*/ 32) {
    			{
    				if (isMounted) {
    					if (isFunction(show)) {
    						open(show);
    					} else {
    						close();
    					}
    				}
    			}
    		}
    	};

    	return [
    		state,
    		Component,
    		background,
    		wrap,
    		modalWindow,
    		cssBg,
    		cssWindowWrap,
    		cssWindow,
    		cssContent,
    		cssCloseButton,
    		currentTransitionBg,
    		currentTransitionWindow,
    		onOpen,
    		onClose,
    		onOpened,
    		onClosed,
    		isFunction,
    		close,
    		handleKeydown,
    		handleOuterMousedown,
    		handleOuterMouseup,
    		show,
    		key,
    		closeButton,
    		closeOnEsc,
    		closeOnOuterClick,
    		styleBg,
    		styleWindowWrap,
    		styleWindow,
    		styleContent,
    		styleCloseButton,
    		setContext$1,
    		transitionBg,
    		transitionBgProps,
    		transitionWindow,
    		transitionWindowProps,
    		isMounted,
    		$$scope,
    		slots,
    		div1_binding,
    		div2_binding,
    		div3_binding
    	];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$1,
    			create_fragment$1,
    			safe_not_equal,
    			{
    				show: 21,
    				key: 22,
    				closeButton: 23,
    				closeOnEsc: 24,
    				closeOnOuterClick: 25,
    				styleBg: 26,
    				styleWindowWrap: 27,
    				styleWindow: 28,
    				styleContent: 29,
    				styleCloseButton: 30,
    				setContext: 31,
    				transitionBg: 32,
    				transitionBgProps: 33,
    				transitionWindow: 34,
    				transitionWindowProps: 35
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get show() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set show(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get key() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeButton() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeButton(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeOnEsc() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeOnEsc(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeOnOuterClick() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeOnOuterClick(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleBg() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleBg(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleWindowWrap() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleWindowWrap(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleWindow() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleWindow(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleContent() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleContent(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleCloseButton() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleCloseButton(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get setContext() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set setContext(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionBg() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionBg(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionBgProps() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionBgProps(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionWindow() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionWindow(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionWindowProps() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionWindowProps(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.44.0 */
    const file = "src/App.svelte";

    // (173:3) <Modal>
    function create_default_slot(ctx) {
    	let factitem;
    	let current;
    	factitem = new FactItem({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(factitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(factitem, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(factitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(factitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(factitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(173:3) <Modal>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let header;
    	let div0;
    	let a0;
    	let t1;
    	let div1;
    	let span0;
    	let t2;
    	let input;
    	let t3;
    	let button0;
    	let t5;
    	let main;
    	let section0;
    	let div15;
    	let h20;
    	let t7;
    	let div2;
    	let t8;
    	let div13;
    	let div6;
    	let div4;
    	let img0;
    	let img0_src_value;
    	let t9;
    	let div3;
    	let t11;
    	let div5;
    	let t12;
    	let div12;
    	let div11;
    	let div10;
    	let div9;
    	let p0;
    	let t14;
    	let div7;
    	let a1;
    	let t16;
    	let div8;
    	let t17;
    	let div14;
    	let t18;
    	let modal;
    	let t19;
    	let section1;
    	let div27;
    	let h21;
    	let t21;
    	let div16;
    	let t22;
    	let div25;
    	let div19;
    	let div17;
    	let img1;
    	let img1_src_value;
    	let t23;
    	let h30;
    	let t25;
    	let p1;
    	let t27;
    	let div18;
    	let t28;
    	let div22;
    	let div20;
    	let img2;
    	let img2_src_value;
    	let t29;
    	let h31;
    	let t31;
    	let p2;
    	let t33;
    	let div21;
    	let t34;
    	let div24;
    	let div23;
    	let img3;
    	let img3_src_value;
    	let t35;
    	let h32;
    	let t37;
    	let p3;
    	let t39;
    	let div26;
    	let p4;
    	let t40;
    	let a2;
    	let t42;
    	let t43;
    	let section2;
    	let div47;
    	let h22;
    	let t45;
    	let div28;
    	let t46;
    	let div46;
    	let div36;
    	let div35;
    	let div30;
    	let div29;
    	let span1;
    	let t48;
    	let h33;
    	let t50;
    	let p5;
    	let t52;
    	let div32;
    	let div31;
    	let span2;
    	let t54;
    	let h34;
    	let t56;
    	let p6;
    	let t58;
    	let div34;
    	let div33;
    	let span3;
    	let t60;
    	let h35;
    	let t62;
    	let p7;
    	let t64;
    	let span4;
    	let t65;
    	let div45;
    	let div37;
    	let t66;
    	let div44;
    	let div39;
    	let div38;
    	let span5;
    	let t68;
    	let h36;
    	let t70;
    	let p8;
    	let t72;
    	let div41;
    	let div40;
    	let span6;
    	let t74;
    	let h37;
    	let t76;
    	let p9;
    	let t78;
    	let div43;
    	let div42;
    	let span7;
    	let t80;
    	let h38;
    	let t82;
    	let p10;
    	let t84;
    	let span8;
    	let t85;
    	let section3;
    	let div84;
    	let h23;
    	let t87;
    	let div48;
    	let t88;
    	let ul0;
    	let li0;
    	let t90;
    	let li1;
    	let t92;
    	let li2;
    	let t94;
    	let li3;
    	let t96;
    	let li4;
    	let t98;
    	let div49;
    	let select;
    	let option0;
    	let option1;
    	let option2;
    	let option3;
    	let option4;
    	let t104;
    	let div82;
    	let div54;
    	let a3;
    	let div53;
    	let div50;
    	let span9;
    	let t106;
    	let h40;
    	let t108;
    	let span10;
    	let i0;
    	let t109;
    	let div52;
    	let img4;
    	let img4_src_value;
    	let t110;
    	let div51;
    	let t111;
    	let div60;
    	let a4;
    	let div58;
    	let div55;
    	let span11;
    	let t113;
    	let h41;
    	let t115;
    	let span12;
    	let i1;
    	let t116;
    	let div57;
    	let img5;
    	let img5_src_value;
    	let t117;
    	let div56;
    	let t118;
    	let div59;
    	let img6;
    	let img6_src_value;
    	let t119;
    	let h24;
    	let t121;
    	let p11;
    	let t123;
    	let p12;
    	let t125;
    	let a5;
    	let t127;
    	let div65;
    	let a6;
    	let div64;
    	let div61;
    	let span13;
    	let t129;
    	let h42;
    	let t131;
    	let span14;
    	let i2;
    	let t132;
    	let div63;
    	let img7;
    	let img7_src_value;
    	let t133;
    	let div62;
    	let t134;
    	let div70;
    	let a7;
    	let div69;
    	let div66;
    	let span15;
    	let t136;
    	let h43;
    	let t138;
    	let span16;
    	let i3;
    	let t139;
    	let div68;
    	let img8;
    	let img8_src_value;
    	let t140;
    	let div67;
    	let t141;
    	let div76;
    	let a8;
    	let div74;
    	let div71;
    	let span17;
    	let t143;
    	let h44;
    	let t145;
    	let span18;
    	let i4;
    	let t146;
    	let div73;
    	let img9;
    	let img9_src_value;
    	let t147;
    	let div72;
    	let t148;
    	let div75;
    	let a9;
    	let t149;
    	let a10;
    	let t150;
    	let div81;
    	let a11;
    	let div80;
    	let div77;
    	let span19;
    	let t152;
    	let h45;
    	let t154;
    	let span20;
    	let i5;
    	let t155;
    	let div79;
    	let img10;
    	let img10_src_value;
    	let t156;
    	let div78;
    	let t157;
    	let div83;
    	let a12;
    	let i6;
    	let t158;
    	let t159;
    	let ul1;
    	let li5;
    	let t161;
    	let li6;
    	let a13;
    	let t163;
    	let section4;
    	let div126;
    	let h25;
    	let t165;
    	let div85;
    	let t166;
    	let div100;
    	let div99;
    	let div98;
    	let div88;
    	let div86;
    	let img11;
    	let img11_src_value;
    	let t167;
    	let h46;
    	let t169;
    	let span21;
    	let t171;
    	let div87;
    	let p13;
    	let t173;
    	let div91;
    	let div89;
    	let img12;
    	let img12_src_value;
    	let t174;
    	let h47;
    	let t176;
    	let span22;
    	let t178;
    	let div90;
    	let p14;
    	let t180;
    	let div94;
    	let div92;
    	let img13;
    	let img13_src_value;
    	let t181;
    	let h48;
    	let t183;
    	let span23;
    	let t185;
    	let div93;
    	let p15;
    	let t187;
    	let div97;
    	let div95;
    	let img14;
    	let img14_src_value;
    	let t188;
    	let h49;
    	let t190;
    	let span24;
    	let t192;
    	let div96;
    	let p16;
    	let t194;
    	let ul2;
    	let li7;
    	let button1;
    	let li8;
    	let button2;
    	let t197;
    	let div125;
    	let div103;
    	let div102;
    	let div101;
    	let img15;
    	let img15_src_value;
    	let t198;
    	let div106;
    	let div105;
    	let div104;
    	let img16;
    	let img16_src_value;
    	let t199;
    	let div109;
    	let div108;
    	let div107;
    	let img17;
    	let img17_src_value;
    	let t200;
    	let div112;
    	let div111;
    	let div110;
    	let img18;
    	let img18_src_value;
    	let t201;
    	let div115;
    	let div114;
    	let div113;
    	let img19;
    	let img19_src_value;
    	let t202;
    	let div118;
    	let div117;
    	let div116;
    	let img20;
    	let img20_src_value;
    	let t203;
    	let div121;
    	let div120;
    	let div119;
    	let img21;
    	let img21_src_value;
    	let t204;
    	let div124;
    	let div123;
    	let div122;
    	let img22;
    	let img22_src_value;
    	let t205;
    	let section5;
    	let div141;
    	let h26;
    	let t207;
    	let div127;
    	let t208;
    	let div140;
    	let div131;
    	let div130;
    	let div128;
    	let a14;
    	let span25;
    	let t210;
    	let a15;
    	let img23;
    	let img23_src_value;
    	let t211;
    	let div129;
    	let h410;
    	let a16;
    	let t213;
    	let ul3;
    	let li9;
    	let t215;
    	let li10;
    	let t217;
    	let div135;
    	let div134;
    	let div132;
    	let a17;
    	let span26;
    	let t219;
    	let a18;
    	let img24;
    	let img24_src_value;
    	let t220;
    	let div133;
    	let h411;
    	let a19;
    	let t222;
    	let ul4;
    	let li11;
    	let t224;
    	let li12;
    	let t226;
    	let div139;
    	let div138;
    	let div136;
    	let a20;
    	let span27;
    	let t228;
    	let a21;
    	let img25;
    	let img25_src_value;
    	let t229;
    	let div137;
    	let h412;
    	let a22;
    	let t231;
    	let ul5;
    	let li13;
    	let t233;
    	let li14;
    	let t235;
    	let section6;
    	let div147;
    	let h27;
    	let t237;
    	let div142;
    	let t238;
    	let div146;
    	let div144;
    	let div143;
    	let h39;
    	let t240;
    	let p17;
    	let t241;
    	let a23;
    	let t243;
    	let t244;
    	let div145;
    	let img26;
    	let img26_src_value;
    	let t245;
    	let div148;
    	let current;

    	modal = new Modal({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			header = element("header");
    			div0 = element("div");
    			a0 = element("a");
    			a0.textContent = "HSBC Regonization";
    			t1 = space();
    			div1 = element("div");
    			span0 = element("span");
    			t2 = space();
    			input = element("input");
    			t3 = space();
    			button0 = element("button");
    			button0.textContent = "Search";
    			t5 = space();
    			main = element("main");
    			section0 = element("section");
    			div15 = element("div");
    			h20 = element("h2");
    			h20.textContent = "About Me";
    			t7 = space();
    			div2 = element("div");
    			t8 = space();
    			div13 = element("div");
    			div6 = element("div");
    			div4 = element("div");
    			img0 = element("img");
    			t9 = space();
    			div3 = element("div");
    			div3.textContent = "Seven";
    			t11 = space();
    			div5 = element("div");
    			t12 = space();
    			div12 = element("div");
    			div11 = element("div");
    			div10 = element("div");
    			div9 = element("div");
    			p0 = element("p");
    			p0.textContent = "I am Bolby Doe, web developer from London, United Kingdom. I have rich experience in web site design and building and customization, also I am good at WordPress.";
    			t14 = space();
    			div7 = element("div");
    			a1 = element("a");
    			a1.textContent = "Print Profile";
    			t16 = space();
    			div8 = element("div");
    			t17 = space();
    			div14 = element("div");
    			t18 = space();
    			create_component(modal.$$.fragment);
    			t19 = space();
    			section1 = element("section");
    			div27 = element("div");
    			h21 = element("h2");
    			h21.textContent = "Services";
    			t21 = space();
    			div16 = element("div");
    			t22 = space();
    			div25 = element("div");
    			div19 = element("div");
    			div17 = element("div");
    			img1 = element("img");
    			t23 = space();
    			h30 = element("h3");
    			h30.textContent = "UI/UX design";
    			t25 = space();
    			p1 = element("p");
    			p1.textContent = "Lorem ipsum dolor sit amet consectetuer adipiscing elit aenean commodo ligula eget.";
    			t27 = space();
    			div18 = element("div");
    			t28 = space();
    			div22 = element("div");
    			div20 = element("div");
    			img2 = element("img");
    			t29 = space();
    			h31 = element("h3");
    			h31.textContent = "Web Development";
    			t31 = space();
    			p2 = element("p");
    			p2.textContent = "Lorem ipsum dolor sit amet consectetuer adipiscing elit aenean commodo ligula eget.";
    			t33 = space();
    			div21 = element("div");
    			t34 = space();
    			div24 = element("div");
    			div23 = element("div");
    			img3 = element("img");
    			t35 = space();
    			h32 = element("h3");
    			h32.textContent = "Photography";
    			t37 = space();
    			p3 = element("p");
    			p3.textContent = "Lorem ipsum dolor sit amet consectetuer adipiscing elit aenean commodo ligula eget.";
    			t39 = space();
    			div26 = element("div");
    			p4 = element("p");
    			t40 = text("Looking for a custom job? ");
    			a2 = element("a");
    			a2.textContent = "Click here";
    			t42 = text(" to contact me! 👋");
    			t43 = space();
    			section2 = element("section");
    			div47 = element("div");
    			h22 = element("h2");
    			h22.textContent = "Experience";
    			t45 = space();
    			div28 = element("div");
    			t46 = space();
    			div46 = element("div");
    			div36 = element("div");
    			div35 = element("div");
    			div30 = element("div");
    			div29 = element("div");
    			span1 = element("span");
    			span1.textContent = "2019 - Present";
    			t48 = space();
    			h33 = element("h3");
    			h33.textContent = "Academic Degree";
    			t50 = space();
    			p5 = element("p");
    			p5.textContent = "Lorem ipsum dolor sit amet quo ei simul congue exerci ad nec admodum perfecto.";
    			t52 = space();
    			div32 = element("div");
    			div31 = element("div");
    			span2 = element("span");
    			span2.textContent = "2017 - 2013";
    			t54 = space();
    			h34 = element("h3");
    			h34.textContent = "Bachelor’s Degree";
    			t56 = space();
    			p6 = element("p");
    			p6.textContent = "Lorem ipsum dolor sit amet quo ei simul congue exerci ad nec admodum perfecto.";
    			t58 = space();
    			div34 = element("div");
    			div33 = element("div");
    			span3 = element("span");
    			span3.textContent = "2013 - 2009";
    			t60 = space();
    			h35 = element("h3");
    			h35.textContent = "Honours Degree";
    			t62 = space();
    			p7 = element("p");
    			p7.textContent = "Lorem ipsum dolor sit amet quo ei simul congue exerci ad nec admodum perfecto.";
    			t64 = space();
    			span4 = element("span");
    			t65 = space();
    			div45 = element("div");
    			div37 = element("div");
    			t66 = space();
    			div44 = element("div");
    			div39 = element("div");
    			div38 = element("div");
    			span5 = element("span");
    			span5.textContent = "2019 - Present";
    			t68 = space();
    			h36 = element("h3");
    			h36.textContent = "Web Designer";
    			t70 = space();
    			p8 = element("p");
    			p8.textContent = "Lorem ipsum dolor sit amet quo ei simul congue exerci ad nec admodum perfecto.";
    			t72 = space();
    			div41 = element("div");
    			div40 = element("div");
    			span6 = element("span");
    			span6.textContent = "2017 - 2013";
    			t74 = space();
    			h37 = element("h3");
    			h37.textContent = "Front-End Developer";
    			t76 = space();
    			p9 = element("p");
    			p9.textContent = "Lorem ipsum dolor sit amet quo ei simul congue exerci ad nec admodum perfecto.";
    			t78 = space();
    			div43 = element("div");
    			div42 = element("div");
    			span7 = element("span");
    			span7.textContent = "2013 - 2009";
    			t80 = space();
    			h38 = element("h3");
    			h38.textContent = "Back-End Developer";
    			t82 = space();
    			p10 = element("p");
    			p10.textContent = "Lorem ipsum dolor sit amet quo ei simul congue exerci ad nec admodum perfecto.";
    			t84 = space();
    			span8 = element("span");
    			t85 = space();
    			section3 = element("section");
    			div84 = element("div");
    			h23 = element("h2");
    			h23.textContent = "Recent works";
    			t87 = space();
    			div48 = element("div");
    			t88 = space();
    			ul0 = element("ul");
    			li0 = element("li");
    			li0.textContent = "Everything";
    			t90 = space();
    			li1 = element("li");
    			li1.textContent = "Creative";
    			t92 = space();
    			li2 = element("li");
    			li2.textContent = "Art";
    			t94 = space();
    			li3 = element("li");
    			li3.textContent = "Design";
    			t96 = space();
    			li4 = element("li");
    			li4.textContent = "Branding";
    			t98 = space();
    			div49 = element("div");
    			select = element("select");
    			option0 = element("option");
    			option0.textContent = "Everything";
    			option1 = element("option");
    			option1.textContent = "Creative";
    			option2 = element("option");
    			option2.textContent = "Art";
    			option3 = element("option");
    			option3.textContent = "Design";
    			option4 = element("option");
    			option4.textContent = "Branding";
    			t104 = space();
    			div82 = element("div");
    			div54 = element("div");
    			a3 = element("a");
    			div53 = element("div");
    			div50 = element("div");
    			span9 = element("span");
    			span9.textContent = "Art";
    			t106 = space();
    			h40 = element("h4");
    			h40.textContent = "Project Managment Illustration";
    			t108 = space();
    			span10 = element("span");
    			i0 = element("i");
    			t109 = space();
    			div52 = element("div");
    			img4 = element("img");
    			t110 = space();
    			div51 = element("div");
    			t111 = space();
    			div60 = element("div");
    			a4 = element("a");
    			div58 = element("div");
    			div55 = element("div");
    			span11 = element("span");
    			span11.textContent = "Creative";
    			t113 = space();
    			h41 = element("h4");
    			h41.textContent = "Guest App Walkthrough Screens";
    			t115 = space();
    			span12 = element("span");
    			i1 = element("i");
    			t116 = space();
    			div57 = element("div");
    			img5 = element("img");
    			t117 = space();
    			div56 = element("div");
    			t118 = space();
    			div59 = element("div");
    			img6 = element("img");
    			t119 = space();
    			h24 = element("h2");
    			h24.textContent = "Guest App Walkthrough Screens";
    			t121 = space();
    			p11 = element("p");
    			p11.textContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam hendrerit nibh in massa semper rutrum. In rhoncus eleifend mi id tempus.";
    			t123 = space();
    			p12 = element("p");
    			p12.textContent = "Donec consectetur, libero at pretium euismod, nisl felis lobortis urna, id tristique nisl lectus eget ligula.";
    			t125 = space();
    			a5 = element("a");
    			a5.textContent = "View on Dribbble";
    			t127 = space();
    			div65 = element("div");
    			a6 = element("a");
    			div64 = element("div");
    			div61 = element("div");
    			span13 = element("span");
    			span13.textContent = "Branding";
    			t129 = space();
    			h42 = element("h4");
    			h42.textContent = "Delivery App Wireframe";
    			t131 = space();
    			span14 = element("span");
    			i2 = element("i");
    			t132 = space();
    			div63 = element("div");
    			img7 = element("img");
    			t133 = space();
    			div62 = element("div");
    			t134 = space();
    			div70 = element("div");
    			a7 = element("a");
    			div69 = element("div");
    			div66 = element("div");
    			span15 = element("span");
    			span15.textContent = "Creative";
    			t136 = space();
    			h43 = element("h4");
    			h43.textContent = "Onboarding Motivation";
    			t138 = space();
    			span16 = element("span");
    			i3 = element("i");
    			t139 = space();
    			div68 = element("div");
    			img8 = element("img");
    			t140 = space();
    			div67 = element("div");
    			t141 = space();
    			div76 = element("div");
    			a8 = element("a");
    			div74 = element("div");
    			div71 = element("div");
    			span17 = element("span");
    			span17.textContent = "Art, Branding";
    			t143 = space();
    			h44 = element("h4");
    			h44.textContent = "iMac Mockup Design";
    			t145 = space();
    			span18 = element("span");
    			i4 = element("i");
    			t146 = space();
    			div73 = element("div");
    			img9 = element("img");
    			t147 = space();
    			div72 = element("div");
    			t148 = space();
    			div75 = element("div");
    			a9 = element("a");
    			t149 = space();
    			a10 = element("a");
    			t150 = space();
    			div81 = element("div");
    			a11 = element("a");
    			div80 = element("div");
    			div77 = element("div");
    			span19 = element("span");
    			span19.textContent = "Creative, Design";
    			t152 = space();
    			h45 = element("h4");
    			h45.textContent = "Game Store App Concept";
    			t154 = space();
    			span20 = element("span");
    			i5 = element("i");
    			t155 = space();
    			div79 = element("div");
    			img10 = element("img");
    			t156 = space();
    			div78 = element("div");
    			t157 = space();
    			div83 = element("div");
    			a12 = element("a");
    			i6 = element("i");
    			t158 = text(" Load more");
    			t159 = space();
    			ul1 = element("ul");
    			li5 = element("li");
    			li5.textContent = "1";
    			t161 = space();
    			li6 = element("li");
    			a13 = element("a");
    			a13.textContent = "2";
    			t163 = space();
    			section4 = element("section");
    			div126 = element("div");
    			h25 = element("h2");
    			h25.textContent = "Clients & Reviews";
    			t165 = space();
    			div85 = element("div");
    			t166 = space();
    			div100 = element("div");
    			div99 = element("div");
    			div98 = element("div");
    			div88 = element("div");
    			div86 = element("div");
    			img11 = element("img");
    			t167 = space();
    			h46 = element("h4");
    			h46.textContent = "John Doe";
    			t169 = space();
    			span21 = element("span");
    			span21.textContent = "Product designer at Dribbble";
    			t171 = space();
    			div87 = element("div");
    			p13 = element("p");
    			p13.textContent = "I enjoy working with the theme and learn so much. You guys make the process fun and interesting. Good luck! 🔥";
    			t173 = space();
    			div91 = element("div");
    			div89 = element("div");
    			img12 = element("img");
    			t174 = space();
    			h47 = element("h4");
    			h47.textContent = "John Doe";
    			t176 = space();
    			span22 = element("span");
    			span22.textContent = "Product designer at Dribbble";
    			t178 = space();
    			div90 = element("div");
    			p14 = element("p");
    			p14.textContent = "I enjoy working with the theme and learn so much. You guys make the process fun and interesting. Good luck! 👍";
    			t180 = space();
    			div94 = element("div");
    			div92 = element("div");
    			img13 = element("img");
    			t181 = space();
    			h48 = element("h4");
    			h48.textContent = "John Doe";
    			t183 = space();
    			span23 = element("span");
    			span23.textContent = "Product designer at Dribbble";
    			t185 = space();
    			div93 = element("div");
    			p15 = element("p");
    			p15.textContent = "I enjoy working with the theme and learn so much. You guys make the process fun and interesting. Good luck! 🔥";
    			t187 = space();
    			div97 = element("div");
    			div95 = element("div");
    			img14 = element("img");
    			t188 = space();
    			h49 = element("h4");
    			h49.textContent = "John Doe";
    			t190 = space();
    			span24 = element("span");
    			span24.textContent = "Product designer at Dribbble";
    			t192 = space();
    			div96 = element("div");
    			p16 = element("p");
    			p16.textContent = "I enjoy working with the theme and learn so much. You guys make the process fun and interesting. Good luck! 👍";
    			t194 = space();
    			ul2 = element("ul");
    			li7 = element("li");
    			button1 = element("button");
    			button1.textContent = "1";
    			li8 = element("li");
    			button2 = element("button");
    			button2.textContent = "2";
    			t197 = space();
    			div125 = element("div");
    			div103 = element("div");
    			div102 = element("div");
    			div101 = element("div");
    			img15 = element("img");
    			t198 = space();
    			div106 = element("div");
    			div105 = element("div");
    			div104 = element("div");
    			img16 = element("img");
    			t199 = space();
    			div109 = element("div");
    			div108 = element("div");
    			div107 = element("div");
    			img17 = element("img");
    			t200 = space();
    			div112 = element("div");
    			div111 = element("div");
    			div110 = element("div");
    			img18 = element("img");
    			t201 = space();
    			div115 = element("div");
    			div114 = element("div");
    			div113 = element("div");
    			img19 = element("img");
    			t202 = space();
    			div118 = element("div");
    			div117 = element("div");
    			div116 = element("div");
    			img20 = element("img");
    			t203 = space();
    			div121 = element("div");
    			div120 = element("div");
    			div119 = element("div");
    			img21 = element("img");
    			t204 = space();
    			div124 = element("div");
    			div123 = element("div");
    			div122 = element("div");
    			img22 = element("img");
    			t205 = space();
    			section5 = element("section");
    			div141 = element("div");
    			h26 = element("h2");
    			h26.textContent = "Latest Posts";
    			t207 = space();
    			div127 = element("div");
    			t208 = space();
    			div140 = element("div");
    			div131 = element("div");
    			div130 = element("div");
    			div128 = element("div");
    			a14 = element("a");
    			span25 = element("span");
    			span25.textContent = "Reviews";
    			t210 = space();
    			a15 = element("a");
    			img23 = element("img");
    			t211 = space();
    			div129 = element("div");
    			h410 = element("h4");
    			a16 = element("a");
    			a16.textContent = "5 Best App Development Tool for Your Project";
    			t213 = space();
    			ul3 = element("ul");
    			li9 = element("li");
    			li9.textContent = "09 February, 2020";
    			t215 = space();
    			li10 = element("li");
    			li10.textContent = "Bolby";
    			t217 = space();
    			div135 = element("div");
    			div134 = element("div");
    			div132 = element("div");
    			a17 = element("a");
    			span26 = element("span");
    			span26.textContent = "Tutorial";
    			t219 = space();
    			a18 = element("a");
    			img24 = element("img");
    			t220 = space();
    			div133 = element("div");
    			h411 = element("h4");
    			a19 = element("a");
    			a19.textContent = "Common Misconceptions About Payment";
    			t222 = space();
    			ul4 = element("ul");
    			li11 = element("li");
    			li11.textContent = "07 February, 2020";
    			t224 = space();
    			li12 = element("li");
    			li12.textContent = "Bolby";
    			t226 = space();
    			div139 = element("div");
    			div138 = element("div");
    			div136 = element("div");
    			a20 = element("a");
    			span27 = element("span");
    			span27.textContent = "Business";
    			t228 = space();
    			a21 = element("a");
    			img25 = element("img");
    			t229 = space();
    			div137 = element("div");
    			h412 = element("h4");
    			a22 = element("a");
    			a22.textContent = "3 Things To Know About Startup Business";
    			t231 = space();
    			ul5 = element("ul");
    			li13 = element("li");
    			li13.textContent = "06 February, 2020";
    			t233 = space();
    			li14 = element("li");
    			li14.textContent = "Bolby";
    			t235 = space();
    			section6 = element("section");
    			div147 = element("div");
    			h27 = element("h2");
    			h27.textContent = "Get In Touch";
    			t237 = space();
    			div142 = element("div");
    			t238 = space();
    			div146 = element("div");
    			div144 = element("div");
    			div143 = element("div");
    			h39 = element("h3");
    			h39.textContent = "Let's talk about everything!";
    			t240 = space();
    			p17 = element("p");
    			t241 = text("Don't like forms? Send me an ");
    			a23 = element("a");
    			a23.textContent = "email";
    			t243 = text(". 👋");
    			t244 = space();
    			div145 = element("div");
    			img26 = element("img");
    			t245 = space();
    			div148 = element("div");
    			attr_dev(a0, "href", "#");
    			attr_dev(a0, "class", "svelte-18q8k5q");
    			add_location(a0, file, 10, 2, 197);
    			attr_dev(div0, "class", "logo svelte-18q8k5q");
    			add_location(div0, file, 9, 1, 176);
    			attr_dev(span0, "class", "search-icon svelte-18q8k5q");
    			add_location(span0, file, 13, 2, 263);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "Search...");
    			attr_dev(input, "class", "svelte-18q8k5q");
    			add_location(input, file, 14, 2, 299);
    			attr_dev(button0, "class", "button button-primary svelte-18q8k5q");
    			add_location(button0, file, 15, 2, 345);
    			attr_dev(div1, "class", "search svelte-18q8k5q");
    			add_location(div1, file, 12, 1, 240);
    			attr_dev(header, "class", "svelte-18q8k5q");
    			add_location(header, file, 8, 0, 166);
    			attr_dev(h20, "class", "section-title wow fadeInUp");
    			set_style(h20, "visibility", "visible");
    			set_style(h20, "animation-name", "fadeInUp");
    			add_location(h20, file, 93, 3, 8334);
    			attr_dev(div2, "class", "spacer");
    			attr_dev(div2, "data-height", "60");
    			set_style(div2, "height", "60px");
    			add_location(div2, file, 95, 3, 8446);
    			if (!src_url_equal(img0.src, img0_src_value = "images/avatar-2.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Bolby");
    			add_location(img0, file, 102, 6, 8662);
    			set_style(div3, "text-align", "center");
    			set_style(div3, "margin-top", "20px");
    			set_style(div3, "font-size", "26px");
    			set_style(div3, "font-weight", "bold");
    			add_location(div3, file, 103, 6, 8712);
    			attr_dev(div4, "class", "text-center text-md-left");
    			set_style(div4, "width", "150px");
    			add_location(div4, file, 100, 5, 8567);
    			attr_dev(div5, "class", "spacer d-md-none d-lg-none");
    			attr_dev(div5, "data-height", "30");
    			set_style(div5, "height", "30px");
    			add_location(div5, file, 110, 5, 8876);
    			attr_dev(div6, "class", "col-md-3");
    			add_location(div6, file, 99, 4, 8539);
    			add_location(p0, file, 118, 8, 9175);
    			attr_dev(a1, "href", "#");
    			attr_dev(a1, "class", "btn btn-default");
    			add_location(a1, file, 120, 9, 9432);
    			attr_dev(div7, "class", "mt-3");
    			set_style(div7, "display", "flex");
    			set_style(div7, "flex-direction", "row-reverse");
    			add_location(div7, file, 119, 8, 9352);
    			attr_dev(div8, "class", "spacer d-md-none d-lg-none");
    			attr_dev(div8, "data-height", "30");
    			set_style(div8, "height", "30px");
    			add_location(div8, file, 122, 8, 9509);
    			attr_dev(div9, "class", "");
    			add_location(div9, file, 116, 7, 9124);
    			attr_dev(div10, "class", "row");
    			add_location(div10, file, 115, 6, 9099);
    			attr_dev(div11, "class", "rounded bg-white shadow-dark padding-30");
    			add_location(div11, file, 114, 5, 9039);
    			attr_dev(div12, "class", "col-md-9 triangle-left-md triangle-top-sm");
    			add_location(div12, file, 113, 4, 8978);
    			attr_dev(div13, "class", "row");
    			add_location(div13, file, 97, 3, 8516);
    			attr_dev(div14, "class", "spacer");
    			attr_dev(div14, "data-height", "70");
    			set_style(div14, "height", "70px");
    			add_location(div14, file, 170, 3, 11401);
    			attr_dev(div15, "class", "container");
    			add_location(div15, file, 90, 2, 8280);
    			attr_dev(section0, "id", "about");
    			attr_dev(section0, "class", "svelte-18q8k5q");
    			add_location(section0, file, 88, 1, 8256);
    			attr_dev(h21, "class", "section-title wow fadeInUp");
    			set_style(h21, "visibility", "visible");
    			set_style(h21, "animation-name", "fadeInUp");
    			add_location(h21, file, 185, 3, 11633);
    			attr_dev(div16, "class", "spacer");
    			attr_dev(div16, "data-height", "60");
    			set_style(div16, "height", "60px");
    			add_location(div16, file, 187, 3, 11745);
    			if (!src_url_equal(img1.src, img1_src_value = "images/service-1.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "UI/UX design");
    			add_location(img1, file, 194, 6, 12061);
    			attr_dev(h30, "class", "mb-3 mt-0");
    			add_location(h30, file, 195, 6, 12119);
    			attr_dev(p1, "class", "mb-0");
    			add_location(p1, file, 196, 6, 12165);
    			attr_dev(div17, "class", "service-box rounded data-background padding-30 text-center text-light shadow-blue");
    			attr_dev(div17, "data-color", "#6C6CE5");
    			set_style(div17, "background-color", "rgb(108, 108, 229)");
    			add_location(div17, file, 193, 5, 11892);
    			attr_dev(div18, "class", "spacer d-md-none d-lg-none");
    			attr_dev(div18, "data-height", "30");
    			set_style(div18, "height", "30px");
    			add_location(div18, file, 198, 5, 12286);
    			attr_dev(div19, "class", "col-md-4");
    			add_location(div19, file, 191, 4, 11838);
    			if (!src_url_equal(img2.src, img2_src_value = "images/service-2.svg")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "UI/UX design");
    			add_location(img2, file, 204, 6, 12601);
    			attr_dev(h31, "class", "mb-3 mt-0");
    			add_location(h31, file, 205, 6, 12659);
    			attr_dev(p2, "class", "mb-0");
    			add_location(p2, file, 206, 6, 12708);
    			attr_dev(div20, "class", "service-box rounded data-background padding-30 text-center shadow-yellow");
    			attr_dev(div20, "data-color", "#F9D74C");
    			set_style(div20, "background-color", "rgb(249, 215, 76)");
    			add_location(div20, file, 203, 5, 12442);
    			attr_dev(div21, "class", "spacer d-md-none d-lg-none");
    			attr_dev(div21, "data-height", "30");
    			set_style(div21, "height", "30px");
    			add_location(div21, file, 208, 5, 12829);
    			attr_dev(div22, "class", "col-md-4");
    			add_location(div22, file, 201, 4, 12388);
    			if (!src_url_equal(img3.src, img3_src_value = "images/service-3.svg")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "UI/UX design");
    			add_location(img3, file, 214, 6, 13154);
    			attr_dev(h32, "class", "mb-3 mt-0");
    			add_location(h32, file, 215, 6, 13212);
    			attr_dev(p3, "class", "mb-0");
    			add_location(p3, file, 216, 6, 13257);
    			attr_dev(div23, "class", "service-box rounded data-background padding-30 text-center text-light shadow-pink");
    			attr_dev(div23, "data-color", "#F97B8B");
    			set_style(div23, "background-color", "rgb(249, 123, 139)");
    			add_location(div23, file, 213, 5, 12985);
    			attr_dev(div24, "class", "col-md-4");
    			add_location(div24, file, 211, 4, 12931);
    			attr_dev(div25, "class", "row");
    			add_location(div25, file, 189, 3, 11815);
    			attr_dev(a2, "href", "#contact");
    			add_location(a2, file, 223, 46, 13476);
    			attr_dev(p4, "class", "mb-0");
    			add_location(p4, file, 223, 4, 13434);
    			attr_dev(div26, "class", "mt-5 text-center");
    			add_location(div26, file, 222, 3, 13399);
    			attr_dev(div27, "class", "container");
    			add_location(div27, file, 182, 2, 11579);
    			attr_dev(section1, "id", "services");
    			add_location(section1, file, 180, 1, 11552);
    			attr_dev(h22, "class", "section-title wow fadeInUp");
    			set_style(h22, "visibility", "visible");
    			set_style(h22, "animation-name", "fadeInUp");
    			add_location(h22, file, 236, 3, 13679);
    			attr_dev(div28, "class", "spacer");
    			attr_dev(div28, "data-height", "60");
    			set_style(div28, "height", "60px");
    			add_location(div28, file, 238, 3, 13793);
    			attr_dev(span1, "class", "time");
    			add_location(span1, file, 250, 8, 14203);
    			attr_dev(h33, "class", "title");
    			add_location(h33, file, 251, 8, 14252);
    			add_location(p5, file, 252, 8, 14299);
    			attr_dev(div29, "class", "content");
    			add_location(div29, file, 249, 7, 14173);
    			attr_dev(div30, "class", "timeline-container wow fadeInUp");
    			set_style(div30, "visibility", "visible");
    			set_style(div30, "animation-name", "fadeInUp");
    			add_location(div30, file, 248, 6, 14065);
    			attr_dev(span2, "class", "time");
    			add_location(span2, file, 259, 8, 14631);
    			attr_dev(h34, "class", "title");
    			add_location(h34, file, 260, 8, 14677);
    			add_location(p6, file, 261, 8, 14726);
    			attr_dev(div31, "class", "content");
    			add_location(div31, file, 258, 7, 14601);
    			attr_dev(div32, "class", "timeline-container wow fadeInUp");
    			attr_dev(div32, "data-wow-delay", "0.2s");
    			set_style(div32, "visibility", "visible");
    			set_style(div32, "animation-delay", "0.2s");
    			set_style(div32, "animation-name", "fadeInUp");
    			add_location(div32, file, 257, 6, 14448);
    			attr_dev(span3, "class", "time");
    			add_location(span3, file, 268, 8, 15058);
    			attr_dev(h35, "class", "title");
    			add_location(h35, file, 269, 8, 15104);
    			add_location(p7, file, 270, 8, 15150);
    			attr_dev(div33, "class", "content");
    			add_location(div33, file, 267, 7, 15028);
    			attr_dev(div34, "class", "timeline-container wow fadeInUp");
    			attr_dev(div34, "data-wow-delay", "0.4s");
    			set_style(div34, "visibility", "visible");
    			set_style(div34, "animation-delay", "0.4s");
    			set_style(div34, "animation-name", "fadeInUp");
    			add_location(div34, file, 266, 6, 14875);
    			attr_dev(span4, "class", "line");
    			add_location(span4, file, 275, 6, 15295);
    			attr_dev(div35, "class", "timeline edu bg-white rounded shadow-dark padding-30 overflow-hidden");
    			add_location(div35, file, 245, 5, 13946);
    			attr_dev(div36, "class", "col-md-6");
    			add_location(div36, file, 242, 4, 13886);
    			attr_dev(div37, "class", "spacer d-md-none d-lg-none");
    			attr_dev(div37, "data-height", "30");
    			set_style(div37, "height", "30px");
    			add_location(div37, file, 284, 5, 15413);
    			attr_dev(span5, "class", "time");
    			add_location(span5, file, 292, 8, 15793);
    			attr_dev(h36, "class", "title");
    			add_location(h36, file, 293, 8, 15842);
    			add_location(p8, file, 294, 8, 15886);
    			attr_dev(div38, "class", "content");
    			add_location(div38, file, 291, 7, 15763);
    			attr_dev(div39, "class", "timeline-container wow fadeInUp");
    			set_style(div39, "visibility", "visible");
    			set_style(div39, "animation-name", "fadeInUp");
    			add_location(div39, file, 290, 6, 15655);
    			attr_dev(span6, "class", "time");
    			add_location(span6, file, 301, 8, 16218);
    			attr_dev(h37, "class", "title");
    			add_location(h37, file, 302, 8, 16264);
    			add_location(p9, file, 303, 8, 16315);
    			attr_dev(div40, "class", "content");
    			add_location(div40, file, 300, 7, 16188);
    			attr_dev(div41, "class", "timeline-container wow fadeInUp");
    			attr_dev(div41, "data-wow-delay", "0.2s");
    			set_style(div41, "visibility", "visible");
    			set_style(div41, "animation-delay", "0.2s");
    			set_style(div41, "animation-name", "fadeInUp");
    			add_location(div41, file, 299, 6, 16035);
    			attr_dev(span7, "class", "time");
    			add_location(span7, file, 310, 8, 16647);
    			attr_dev(h38, "class", "title");
    			add_location(h38, file, 311, 8, 16693);
    			add_location(p10, file, 312, 8, 16743);
    			attr_dev(div42, "class", "content");
    			add_location(div42, file, 309, 7, 16617);
    			attr_dev(div43, "class", "timeline-container wow fadeInUp");
    			attr_dev(div43, "data-wow-delay", "0.4s");
    			set_style(div43, "visibility", "visible");
    			set_style(div43, "animation-delay", "0.4s");
    			set_style(div43, "animation-name", "fadeInUp");
    			add_location(div43, file, 308, 6, 16464);
    			attr_dev(span8, "class", "line");
    			add_location(span8, file, 317, 6, 16888);
    			attr_dev(div44, "class", "timeline exp bg-white rounded shadow-dark padding-30 overflow-hidden");
    			add_location(div44, file, 287, 5, 15536);
    			attr_dev(div45, "class", "col-md-6");
    			add_location(div45, file, 281, 4, 15352);
    			attr_dev(div46, "class", "row");
    			add_location(div46, file, 240, 3, 13863);
    			attr_dev(div47, "class", "container");
    			add_location(div47, file, 233, 2, 13625);
    			attr_dev(section2, "id", "experience");
    			add_location(section2, file, 231, 1, 13596);
    			attr_dev(h23, "class", "section-title wow fadeInUp");
    			set_style(h23, "visibility", "visible");
    			set_style(h23, "animation-name", "fadeInUp");
    			add_location(h23, file, 335, 3, 17078);
    			attr_dev(div48, "class", "spacer");
    			attr_dev(div48, "data-height", "60");
    			set_style(div48, "height", "60px");
    			add_location(div48, file, 337, 3, 17194);
    			attr_dev(li0, "class", "list-inline-item current");
    			attr_dev(li0, "data-filter", "*");
    			add_location(li0, file, 341, 4, 17417);
    			attr_dev(li1, "class", "list-inline-item");
    			attr_dev(li1, "data-filter", ".creative");
    			add_location(li1, file, 342, 4, 17490);
    			attr_dev(li2, "class", "list-inline-item");
    			attr_dev(li2, "data-filter", ".art");
    			add_location(li2, file, 343, 4, 17561);
    			attr_dev(li3, "class", "list-inline-item");
    			attr_dev(li3, "data-filter", ".design");
    			add_location(li3, file, 344, 4, 17622);
    			attr_dev(li4, "class", "list-inline-item");
    			attr_dev(li4, "data-filter", ".branding");
    			add_location(li4, file, 345, 4, 17689);
    			attr_dev(ul0, "class", "portfolio-filter list-inline wow fadeInUp");
    			set_style(ul0, "visibility", "visible");
    			set_style(ul0, "animation-name", "fadeInUp");
    			add_location(ul0, file, 340, 3, 17303);
    			option0.__value = "*";
    			option0.value = option0.__value;
    			add_location(option0, file, 351, 5, 17889);
    			option1.__value = ".creative";
    			option1.value = option1.__value;
    			add_location(option1, file, 352, 5, 17932);
    			option2.__value = ".art";
    			option2.value = option2.__value;
    			add_location(option2, file, 353, 5, 17981);
    			option3.__value = ".design";
    			option3.value = option3.__value;
    			add_location(option3, file, 354, 5, 18020);
    			option4.__value = ".branding";
    			option4.value = option4.__value;
    			add_location(option4, file, 355, 5, 18065);
    			attr_dev(select, "class", "portfolio-filter-mobile");
    			add_location(select, file, 350, 4, 17843);
    			attr_dev(div49, "class", "pf-filter-wrapper");
    			add_location(div49, file, 349, 3, 17807);
    			attr_dev(span9, "class", "term");
    			add_location(span9, file, 367, 8, 18522);
    			attr_dev(h40, "class", "title");
    			add_location(h40, file, 368, 8, 18560);
    			attr_dev(i0, "class", "icon-magnifier-add");
    			add_location(i0, file, 369, 34, 18648);
    			attr_dev(span10, "class", "more-button");
    			add_location(span10, file, 369, 8, 18622);
    			attr_dev(div50, "class", "details");
    			add_location(div50, file, 366, 7, 18492);
    			if (!src_url_equal(img4.src, img4_src_value = "images/works/1.svg")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "alt", "Portfolio-title");
    			add_location(img4, file, 372, 8, 18739);
    			attr_dev(div51, "class", "mask");
    			add_location(div51, file, 373, 8, 18800);
    			attr_dev(div52, "class", "thumb");
    			add_location(div52, file, 371, 7, 18711);
    			attr_dev(div53, "class", "portfolio-item rounded shadow-dark");
    			add_location(div53, file, 365, 6, 18436);
    			attr_dev(a3, "href", "images/works/1.svg");
    			attr_dev(a3, "class", "work-image");
    			add_location(a3, file, 364, 5, 18381);
    			attr_dev(div54, "class", "col-md-4 col-sm-6 grid-item art");
    			set_style(div54, "position", "absolute");
    			set_style(div54, "left", "0%");
    			set_style(div54, "top", "0px");
    			add_location(div54, file, 363, 4, 18282);
    			attr_dev(span11, "class", "term");
    			add_location(span11, file, 384, 8, 19161);
    			attr_dev(h41, "class", "title");
    			add_location(h41, file, 385, 8, 19204);
    			attr_dev(i1, "class", "icon-options");
    			add_location(i1, file, 386, 34, 19291);
    			attr_dev(span12, "class", "more-button");
    			add_location(span12, file, 386, 8, 19265);
    			attr_dev(div55, "class", "details");
    			add_location(div55, file, 383, 7, 19131);
    			if (!src_url_equal(img5.src, img5_src_value = "images/works/2.svg")) attr_dev(img5, "src", img5_src_value);
    			attr_dev(img5, "alt", "Portfolio-title");
    			add_location(img5, file, 389, 8, 19376);
    			attr_dev(div56, "class", "mask");
    			add_location(div56, file, 390, 8, 19437);
    			attr_dev(div57, "class", "thumb");
    			add_location(div57, file, 388, 7, 19348);
    			attr_dev(div58, "class", "portfolio-item rounded shadow-dark");
    			add_location(div58, file, 382, 6, 19075);
    			attr_dev(a4, "href", "#small-dialog");
    			attr_dev(a4, "class", "work-content");
    			add_location(a4, file, 381, 5, 19023);
    			if (!src_url_equal(img6.src, img6_src_value = "images/single-work.svg")) attr_dev(img6, "src", img6_src_value);
    			attr_dev(img6, "alt", "Title");
    			add_location(img6, file, 395, 6, 19580);
    			add_location(h24, file, 396, 6, 19633);
    			add_location(p11, file, 397, 6, 19678);
    			add_location(p12, file, 398, 6, 19827);
    			attr_dev(a5, "href", "#");
    			attr_dev(a5, "class", "btn btn-default");
    			add_location(a5, file, 399, 6, 19950);
    			attr_dev(div59, "id", "small-dialog");
    			attr_dev(div59, "class", "white-popup zoom-anim-dialog mfp-hide");
    			add_location(div59, file, 394, 5, 19504);
    			attr_dev(div60, "class", "col-md-4 col-sm-6 grid-item creative design");
    			set_style(div60, "position", "absolute");
    			set_style(div60, "left", "33.3333%");
    			set_style(div60, "top", "0px");
    			add_location(div60, file, 380, 4, 18906);
    			attr_dev(span13, "class", "term");
    			add_location(span13, file, 408, 8, 20339);
    			attr_dev(h42, "class", "title");
    			add_location(h42, file, 409, 8, 20382);
    			attr_dev(i2, "class", "icon-camrecorder");
    			add_location(i2, file, 410, 34, 20462);
    			attr_dev(span14, "class", "more-button");
    			add_location(span14, file, 410, 8, 20436);
    			attr_dev(div61, "class", "details");
    			add_location(div61, file, 407, 7, 20309);
    			if (!src_url_equal(img7.src, img7_src_value = "images/works/3.svg")) attr_dev(img7, "src", img7_src_value);
    			attr_dev(img7, "alt", "Portfolio-title");
    			add_location(img7, file, 413, 8, 20551);
    			attr_dev(div62, "class", "mask");
    			add_location(div62, file, 414, 8, 20612);
    			attr_dev(div63, "class", "thumb");
    			add_location(div63, file, 412, 7, 20523);
    			attr_dev(div64, "class", "portfolio-item rounded shadow-dark");
    			add_location(div64, file, 406, 6, 20253);
    			attr_dev(a6, "href", "https://www.youtube.com/watch?v=qf9z4ulfmYw");
    			attr_dev(a6, "class", "work-video");
    			add_location(a6, file, 405, 5, 20173);
    			attr_dev(div65, "class", "col-md-4 col-sm-6 grid-item branding");
    			set_style(div65, "position", "absolute");
    			set_style(div65, "left", "66.6667%");
    			set_style(div65, "top", "0px");
    			add_location(div65, file, 404, 4, 20063);
    			attr_dev(span15, "class", "term");
    			add_location(span15, file, 425, 8, 21194);
    			attr_dev(h43, "class", "title");
    			add_location(h43, file, 426, 8, 21237);
    			attr_dev(i3, "class", "icon-music-tone-alt");
    			add_location(i3, file, 427, 34, 21316);
    			attr_dev(span16, "class", "more-button");
    			add_location(span16, file, 427, 8, 21290);
    			attr_dev(div66, "class", "details");
    			add_location(div66, file, 424, 7, 21164);
    			if (!src_url_equal(img8.src, img8_src_value = "images/works/4.svg")) attr_dev(img8, "src", img8_src_value);
    			attr_dev(img8, "alt", "Portfolio-title");
    			add_location(img8, file, 430, 8, 21408);
    			attr_dev(div67, "class", "mask");
    			add_location(div67, file, 431, 8, 21469);
    			attr_dev(div68, "class", "thumb");
    			add_location(div68, file, 429, 7, 21380);
    			attr_dev(div69, "class", "portfolio-item rounded shadow-dark");
    			add_location(div69, file, 423, 6, 21108);
    			attr_dev(a7, "href", "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/240233494&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true");
    			attr_dev(a7, "class", "work-video");
    			add_location(a7, file, 422, 5, 20824);
    			attr_dev(div70, "class", "col-md-4 col-sm-6 grid-item creative");
    			set_style(div70, "position", "absolute");
    			set_style(div70, "left", "0%");
    			set_style(div70, "top", "297px");
    			add_location(div70, file, 421, 4, 20718);
    			attr_dev(span17, "class", "term");
    			add_location(span17, file, 442, 8, 21826);
    			attr_dev(h44, "class", "title");
    			add_location(h44, file, 443, 8, 21874);
    			attr_dev(i4, "class", "icon-picture");
    			add_location(i4, file, 444, 34, 21950);
    			attr_dev(span18, "class", "more-button");
    			add_location(span18, file, 444, 8, 21924);
    			attr_dev(div71, "class", "details");
    			add_location(div71, file, 441, 7, 21796);
    			if (!src_url_equal(img9.src, img9_src_value = "images/works/5.svg")) attr_dev(img9, "src", img9_src_value);
    			attr_dev(img9, "alt", "Portfolio-title");
    			add_location(img9, file, 447, 8, 22035);
    			attr_dev(div72, "class", "mask");
    			add_location(div72, file, 448, 8, 22096);
    			attr_dev(div73, "class", "thumb");
    			add_location(div73, file, 446, 7, 22007);
    			attr_dev(div74, "class", "portfolio-item rounded shadow-dark");
    			add_location(div74, file, 440, 6, 21740);
    			attr_dev(a8, "href", "#gallery-1");
    			attr_dev(a8, "class", "gallery-link");
    			add_location(a8, file, 439, 5, 21691);
    			attr_dev(a9, "href", "images/works/5.svg");
    			add_location(a9, file, 453, 6, 22215);
    			attr_dev(a10, "href", "images/works/4.svg");
    			add_location(a10, file, 454, 6, 22255);
    			attr_dev(div75, "id", "gallery-1");
    			attr_dev(div75, "class", "gallery mfp-hide");
    			add_location(div75, file, 452, 5, 22163);
    			attr_dev(div76, "class", "col-md-4 col-sm-6 grid-item art branding");
    			set_style(div76, "position", "absolute");
    			set_style(div76, "left", "33.3333%");
    			set_style(div76, "top", "297px");
    			add_location(div76, file, 438, 4, 21575);
    			attr_dev(span19, "class", "term");
    			add_location(span19, file, 463, 8, 22635);
    			attr_dev(h45, "class", "title");
    			add_location(h45, file, 464, 8, 22686);
    			attr_dev(i5, "class", "icon-link");
    			add_location(i5, file, 465, 34, 22766);
    			attr_dev(span20, "class", "more-button");
    			add_location(span20, file, 465, 8, 22740);
    			attr_dev(div77, "class", "details");
    			add_location(div77, file, 462, 7, 22605);
    			if (!src_url_equal(img10.src, img10_src_value = "images/works/6.svg")) attr_dev(img10, "src", img10_src_value);
    			attr_dev(img10, "alt", "Portfolio-title");
    			add_location(img10, file, 468, 8, 22848);
    			attr_dev(div78, "class", "mask");
    			add_location(div78, file, 469, 8, 22909);
    			attr_dev(div79, "class", "thumb");
    			add_location(div79, file, 467, 7, 22820);
    			attr_dev(div80, "class", "portfolio-item rounded shadow-dark");
    			add_location(div80, file, 461, 6, 22549);
    			attr_dev(a11, "href", "https://themeforest.net/user/pxlsolutions/portfolio");
    			attr_dev(a11, "target", "_blank");
    			add_location(a11, file, 460, 5, 22464);
    			attr_dev(div81, "class", "col-md-4 col-sm-6 grid-item creative design");
    			set_style(div81, "position", "absolute");
    			set_style(div81, "left", "66.6667%");
    			set_style(div81, "top", "297px");
    			add_location(div81, file, 459, 4, 22345);
    			attr_dev(div82, "class", "row portfolio-wrapper");
    			set_style(div82, "position", "relative");
    			set_style(div82, "height", "595.062px");
    			add_location(div82, file, 360, 3, 18166);
    			attr_dev(i6, "class", "fas fa-spinner");
    			add_location(i6, file, 479, 50, 23112);
    			attr_dev(a12, "href", "javascript:");
    			attr_dev(a12, "class", "btn btn-default");
    			add_location(a12, file, 479, 4, 23066);
    			attr_dev(li5, "class", "list-inline-item");
    			add_location(li5, file, 482, 5, 23281);
    			attr_dev(a13, "href", "works-2.html");
    			add_location(a13, file, 483, 34, 23351);
    			attr_dev(li6, "class", "list-inline-item");
    			add_location(li6, file, 483, 5, 23322);
    			attr_dev(ul1, "class", "portfolio-pagination list-inline d-none");
    			add_location(ul1, file, 481, 4, 23223);
    			attr_dev(div83, "class", "load-more text-center mt-4");
    			add_location(div83, file, 478, 3, 23021);
    			attr_dev(div84, "class", "container");
    			add_location(div84, file, 332, 2, 17024);
    			attr_dev(section3, "id", "works");
    			add_location(section3, file, 330, 1, 17000);
    			attr_dev(h25, "class", "section-title wow fadeInUp");
    			set_style(h25, "visibility", "visible");
    			set_style(h25, "animation-name", "fadeInUp");
    			add_location(h25, file, 552, 3, 25318);
    			attr_dev(div85, "class", "spacer");
    			attr_dev(div85, "data-height", "60");
    			set_style(div85, "height", "60px");
    			add_location(div85, file, 554, 3, 25443);
    			if (!src_url_equal(img11.src, img11_src_value = "images/avatar-1.svg")) attr_dev(img11, "src", img11_src_value);
    			attr_dev(img11, "alt", "customer-name");
    			add_location(img11, file, 562, 6, 26042);
    			attr_dev(div86, "class", "thumb mb-3 mx-auto");
    			add_location(div86, file, 561, 5, 26003);
    			attr_dev(h46, "class", "mt-3 mb-0");
    			add_location(h46, file, 564, 5, 26111);
    			attr_dev(span21, "class", "subtitle");
    			add_location(span21, file, 565, 5, 26152);
    			attr_dev(p13, "class", "mb-0");
    			add_location(p13, file, 567, 6, 26312);
    			attr_dev(div87, "class", "bg-white padding-30 shadow-dark rounded triangle-top position-relative mt-4");
    			add_location(div87, file, 566, 5, 26216);
    			attr_dev(div88, "class", "testimonial-item text-center mx-auto slick-slide slick-cloned");
    			attr_dev(div88, "data-slick-index", "-1");
    			attr_dev(div88, "aria-hidden", "true");
    			attr_dev(div88, "tabindex", "-1");
    			set_style(div88, "width", "700px");
    			add_location(div88, file, 560, 174, 25845);
    			if (!src_url_equal(img12.src, img12_src_value = "images/avatar-3.svg")) attr_dev(img12, "src", img12_src_value);
    			attr_dev(img12, "alt", "customer-name");
    			add_location(img12, file, 571, 6, 26723);
    			attr_dev(div89, "class", "thumb mb-3 mx-auto");
    			add_location(div89, file, 570, 5, 26684);
    			attr_dev(h47, "class", "mt-3 mb-0");
    			add_location(h47, file, 573, 5, 26792);
    			attr_dev(span22, "class", "subtitle");
    			add_location(span22, file, 574, 5, 26833);
    			attr_dev(p14, "class", "mb-0");
    			add_location(p14, file, 576, 6, 26993);
    			attr_dev(div90, "class", "bg-white padding-30 shadow-dark rounded triangle-top position-relative mt-4");
    			add_location(div90, file, 575, 5, 26897);
    			attr_dev(div91, "class", "testimonial-item text-center mx-auto slick-slide slick-current slick-active");
    			attr_dev(div91, "data-slick-index", "0");
    			attr_dev(div91, "aria-hidden", "false");
    			attr_dev(div91, "tabindex", "-1");
    			attr_dev(div91, "role", "option");
    			attr_dev(div91, "aria-describedby", "slick-slide00");
    			set_style(div91, "width", "700px");
    			add_location(div91, file, 569, 10, 26465);
    			if (!src_url_equal(img13.src, img13_src_value = "images/avatar-1.svg")) attr_dev(img13, "src", img13_src_value);
    			attr_dev(img13, "alt", "customer-name");
    			add_location(img13, file, 580, 6, 27376);
    			attr_dev(div92, "class", "thumb mb-3 mx-auto");
    			add_location(div92, file, 579, 5, 27337);
    			attr_dev(h48, "class", "mt-3 mb-0");
    			add_location(h48, file, 582, 5, 27445);
    			attr_dev(span23, "class", "subtitle");
    			add_location(span23, file, 583, 5, 27486);
    			attr_dev(p15, "class", "mb-0");
    			add_location(p15, file, 585, 6, 27646);
    			attr_dev(div93, "class", "bg-white padding-30 shadow-dark rounded triangle-top position-relative mt-4");
    			add_location(div93, file, 584, 5, 27550);
    			attr_dev(div94, "class", "testimonial-item text-center mx-auto slick-slide");
    			attr_dev(div94, "data-slick-index", "1");
    			attr_dev(div94, "aria-hidden", "true");
    			attr_dev(div94, "tabindex", "-1");
    			attr_dev(div94, "role", "option");
    			attr_dev(div94, "aria-describedby", "slick-slide01");
    			set_style(div94, "width", "700px");
    			add_location(div94, file, 578, 10, 27146);
    			if (!src_url_equal(img14.src, img14_src_value = "images/avatar-3.svg")) attr_dev(img14, "src", img14_src_value);
    			attr_dev(img14, "alt", "customer-name");
    			add_location(img14, file, 589, 6, 27995);
    			attr_dev(div95, "class", "thumb mb-3 mx-auto");
    			add_location(div95, file, 588, 5, 27956);
    			attr_dev(h49, "class", "mt-3 mb-0");
    			add_location(h49, file, 591, 5, 28064);
    			attr_dev(span24, "class", "subtitle");
    			add_location(span24, file, 592, 5, 28105);
    			attr_dev(p16, "class", "mb-0");
    			add_location(p16, file, 594, 6, 28265);
    			attr_dev(div96, "class", "bg-white padding-30 shadow-dark rounded triangle-top position-relative mt-4");
    			add_location(div96, file, 593, 5, 28169);
    			attr_dev(div97, "class", "testimonial-item text-center mx-auto slick-slide slick-cloned");
    			attr_dev(div97, "data-slick-index", "2");
    			attr_dev(div97, "aria-hidden", "true");
    			attr_dev(div97, "tabindex", "-1");
    			set_style(div97, "width", "700px");
    			add_location(div97, file, 587, 10, 27799);
    			attr_dev(div98, "class", "slick-track");
    			attr_dev(div98, "role", "listbox");
    			set_style(div98, "opacity", "1");
    			set_style(div98, "width", "2800px");
    			set_style(div98, "transform", "translate3d(-700px, 0px, 0px)");
    			add_location(div98, file, 560, 57, 25728);
    			attr_dev(div99, "aria-live", "polite");
    			attr_dev(div99, "class", "slick-list draggable");
    			add_location(div99, file, 560, 4, 25675);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "data-role", "none");
    			attr_dev(button1, "role", "button");
    			attr_dev(button1, "tabindex", "0");
    			add_location(button1, file, 601, 199, 28663);
    			attr_dev(li7, "class", "slick-active");
    			attr_dev(li7, "aria-hidden", "false");
    			attr_dev(li7, "role", "presentation");
    			attr_dev(li7, "aria-selected", "true");
    			attr_dev(li7, "aria-controls", "navigation00");
    			attr_dev(li7, "id", "slick-slide00");
    			add_location(li7, file, 601, 65, 28529);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "data-role", "none");
    			attr_dev(button2, "role", "button");
    			attr_dev(button2, "tabindex", "0");
    			add_location(button2, file, 601, 402, 28866);
    			attr_dev(li8, "aria-hidden", "true");
    			attr_dev(li8, "role", "presentation");
    			attr_dev(li8, "aria-selected", "false");
    			attr_dev(li8, "aria-controls", "navigation01");
    			attr_dev(li8, "id", "slick-slide01");
    			attr_dev(li8, "class", "");
    			add_location(li8, file, 601, 280, 28744);
    			attr_dev(ul2, "class", "slick-dots");
    			set_style(ul2, "display", "block");
    			attr_dev(ul2, "role", "tablist");
    			add_location(ul2, file, 601, 3, 28467);
    			attr_dev(div100, "class", "testimonials-wrapper slick-initialized slick-slider slick-dotted");
    			attr_dev(div100, "role", "toolbar");
    			add_location(div100, file, 557, 3, 25546);
    			if (!src_url_equal(img15.src, img15_src_value = "images/client-1.svg")) attr_dev(img15, "src", img15_src_value);
    			attr_dev(img15, "alt", "client-name");
    			add_location(img15, file, 608, 7, 29104);
    			attr_dev(div101, "class", "inner");
    			add_location(div101, file, 607, 6, 29077);
    			attr_dev(div102, "class", "client-item");
    			add_location(div102, file, 606, 5, 29045);
    			attr_dev(div103, "class", "col-md-3 col-6");
    			add_location(div103, file, 604, 4, 28985);
    			if (!src_url_equal(img16.src, img16_src_value = "images/client-2.svg")) attr_dev(img16, "src", img16_src_value);
    			attr_dev(img16, "alt", "client-name");
    			add_location(img16, file, 616, 7, 29313);
    			attr_dev(div104, "class", "inner");
    			add_location(div104, file, 615, 6, 29286);
    			attr_dev(div105, "class", "client-item");
    			add_location(div105, file, 614, 5, 29254);
    			attr_dev(div106, "class", "col-md-3 col-6");
    			add_location(div106, file, 612, 4, 29194);
    			if (!src_url_equal(img17.src, img17_src_value = "images/client-3.svg")) attr_dev(img17, "src", img17_src_value);
    			attr_dev(img17, "alt", "client-name");
    			add_location(img17, file, 624, 7, 29522);
    			attr_dev(div107, "class", "inner");
    			add_location(div107, file, 623, 6, 29495);
    			attr_dev(div108, "class", "client-item");
    			add_location(div108, file, 622, 5, 29463);
    			attr_dev(div109, "class", "col-md-3 col-6");
    			add_location(div109, file, 620, 4, 29403);
    			if (!src_url_equal(img18.src, img18_src_value = "images/client-4.svg")) attr_dev(img18, "src", img18_src_value);
    			attr_dev(img18, "alt", "client-name");
    			add_location(img18, file, 632, 7, 29731);
    			attr_dev(div110, "class", "inner");
    			add_location(div110, file, 631, 6, 29704);
    			attr_dev(div111, "class", "client-item");
    			add_location(div111, file, 630, 5, 29672);
    			attr_dev(div112, "class", "col-md-3 col-6");
    			add_location(div112, file, 628, 4, 29612);
    			if (!src_url_equal(img19.src, img19_src_value = "images/client-5.svg")) attr_dev(img19, "src", img19_src_value);
    			attr_dev(img19, "alt", "client-name");
    			add_location(img19, file, 640, 7, 29940);
    			attr_dev(div113, "class", "inner");
    			add_location(div113, file, 639, 6, 29913);
    			attr_dev(div114, "class", "client-item");
    			add_location(div114, file, 638, 5, 29881);
    			attr_dev(div115, "class", "col-md-3 col-6");
    			add_location(div115, file, 636, 4, 29821);
    			if (!src_url_equal(img20.src, img20_src_value = "images/client-6.svg")) attr_dev(img20, "src", img20_src_value);
    			attr_dev(img20, "alt", "client-name");
    			add_location(img20, file, 648, 7, 30149);
    			attr_dev(div116, "class", "inner");
    			add_location(div116, file, 647, 6, 30122);
    			attr_dev(div117, "class", "client-item");
    			add_location(div117, file, 646, 5, 30090);
    			attr_dev(div118, "class", "col-md-3 col-6");
    			add_location(div118, file, 644, 4, 30030);
    			if (!src_url_equal(img21.src, img21_src_value = "images/client-7.svg")) attr_dev(img21, "src", img21_src_value);
    			attr_dev(img21, "alt", "client-name");
    			add_location(img21, file, 656, 7, 30358);
    			attr_dev(div119, "class", "inner");
    			add_location(div119, file, 655, 6, 30331);
    			attr_dev(div120, "class", "client-item");
    			add_location(div120, file, 654, 5, 30299);
    			attr_dev(div121, "class", "col-md-3 col-6");
    			add_location(div121, file, 652, 4, 30239);
    			if (!src_url_equal(img22.src, img22_src_value = "images/client-8.svg")) attr_dev(img22, "src", img22_src_value);
    			attr_dev(img22, "alt", "client-name");
    			add_location(img22, file, 664, 7, 30567);
    			attr_dev(div122, "class", "inner");
    			add_location(div122, file, 663, 6, 30540);
    			attr_dev(div123, "class", "client-item");
    			add_location(div123, file, 662, 5, 30508);
    			attr_dev(div124, "class", "col-md-3 col-6");
    			add_location(div124, file, 660, 4, 30448);
    			attr_dev(div125, "class", "row");
    			add_location(div125, file, 603, 3, 28963);
    			attr_dev(div126, "class", "container");
    			add_location(div126, file, 549, 2, 25264);
    			attr_dev(section4, "id", "testimonials");
    			add_location(section4, file, 547, 1, 25233);
    			attr_dev(h26, "class", "section-title wow fadeInUp");
    			set_style(h26, "visibility", "visible");
    			set_style(h26, "animation-name", "fadeInUp");
    			add_location(h26, file, 680, 3, 30788);
    			attr_dev(div127, "class", "spacer");
    			attr_dev(div127, "data-height", "60");
    			set_style(div127, "height", "60px");
    			add_location(div127, file, 682, 3, 30904);
    			attr_dev(span25, "class", "category");
    			add_location(span25, file, 691, 8, 31280);
    			attr_dev(a14, "href", "#");
    			add_location(a14, file, 690, 7, 31259);
    			if (!src_url_equal(img23.src, img23_src_value = "images/blog/1.svg")) attr_dev(img23, "src", img23_src_value);
    			attr_dev(img23, "alt", "blog-title");
    			add_location(img23, file, 694, 8, 31358);
    			attr_dev(a15, "href", "#");
    			add_location(a15, file, 693, 7, 31337);
    			attr_dev(div128, "class", "thumb");
    			add_location(div128, file, 689, 6, 31232);
    			attr_dev(a16, "href", "#");
    			add_location(a16, file, 698, 30, 31488);
    			attr_dev(h410, "class", "my-0 title");
    			add_location(h410, file, 698, 7, 31465);
    			attr_dev(li9, "class", "list-inline-item");
    			add_location(li9, file, 700, 8, 31609);
    			attr_dev(li10, "class", "list-inline-item");
    			add_location(li10, file, 701, 8, 31669);
    			attr_dev(ul3, "class", "list-inline meta mb-0 mt-2");
    			add_location(ul3, file, 699, 7, 31561);
    			attr_dev(div129, "class", "details");
    			add_location(div129, file, 697, 6, 31436);
    			attr_dev(div130, "class", "blog-item rounded bg-white shadow-dark wow fadeIn");
    			attr_dev(div130, "data-wow-delay", "200ms");
    			set_style(div130, "visibility", "visible");
    			set_style(div130, "animation-delay", "200ms");
    			set_style(div130, "animation-name", "fadeIn");
    			add_location(div130, file, 688, 5, 31062);
    			attr_dev(div131, "class", "col-md-4");
    			add_location(div131, file, 686, 4, 31010);
    			attr_dev(span26, "class", "category");
    			add_location(span26, file, 712, 8, 32033);
    			attr_dev(a17, "href", "#");
    			add_location(a17, file, 711, 7, 32012);
    			if (!src_url_equal(img24.src, img24_src_value = "images/blog/2.svg")) attr_dev(img24, "src", img24_src_value);
    			attr_dev(img24, "alt", "blog-title");
    			add_location(img24, file, 715, 8, 32112);
    			attr_dev(a18, "href", "#");
    			add_location(a18, file, 714, 7, 32091);
    			attr_dev(div132, "class", "thumb");
    			add_location(div132, file, 710, 6, 31985);
    			attr_dev(a19, "href", "#");
    			add_location(a19, file, 719, 30, 32242);
    			attr_dev(h411, "class", "my-0 title");
    			add_location(h411, file, 719, 7, 32219);
    			attr_dev(li11, "class", "list-inline-item");
    			add_location(li11, file, 721, 8, 32354);
    			attr_dev(li12, "class", "list-inline-item");
    			add_location(li12, file, 722, 8, 32414);
    			attr_dev(ul4, "class", "list-inline meta mb-0 mt-2");
    			add_location(ul4, file, 720, 7, 32306);
    			attr_dev(div133, "class", "details");
    			add_location(div133, file, 718, 6, 32190);
    			attr_dev(div134, "class", "blog-item rounded bg-white shadow-dark wow fadeIn");
    			attr_dev(div134, "data-wow-delay", "400ms");
    			set_style(div134, "visibility", "visible");
    			set_style(div134, "animation-delay", "400ms");
    			set_style(div134, "animation-name", "fadeIn");
    			add_location(div134, file, 709, 5, 31815);
    			attr_dev(div135, "class", "col-md-4");
    			add_location(div135, file, 707, 4, 31763);
    			attr_dev(span27, "class", "category");
    			add_location(span27, file, 733, 8, 32778);
    			attr_dev(a20, "href", "#");
    			add_location(a20, file, 732, 7, 32757);
    			if (!src_url_equal(img25.src, img25_src_value = "images/blog/3.svg")) attr_dev(img25, "src", img25_src_value);
    			attr_dev(img25, "alt", "blog-title");
    			add_location(img25, file, 736, 8, 32857);
    			attr_dev(a21, "href", "#");
    			add_location(a21, file, 735, 7, 32836);
    			attr_dev(div136, "class", "thumb");
    			add_location(div136, file, 731, 6, 32730);
    			attr_dev(a22, "href", "#");
    			add_location(a22, file, 740, 30, 32987);
    			attr_dev(h412, "class", "my-0 title");
    			add_location(h412, file, 740, 7, 32964);
    			attr_dev(li13, "class", "list-inline-item");
    			add_location(li13, file, 742, 8, 33103);
    			attr_dev(li14, "class", "list-inline-item");
    			add_location(li14, file, 743, 8, 33163);
    			attr_dev(ul5, "class", "list-inline meta mb-0 mt-2");
    			add_location(ul5, file, 741, 7, 33055);
    			attr_dev(div137, "class", "details");
    			add_location(div137, file, 739, 6, 32935);
    			attr_dev(div138, "class", "blog-item rounded bg-white shadow-dark wow fadeIn");
    			attr_dev(div138, "data-wow-delay", "600ms");
    			set_style(div138, "visibility", "visible");
    			set_style(div138, "animation-delay", "600ms");
    			set_style(div138, "animation-name", "fadeIn");
    			add_location(div138, file, 730, 5, 32560);
    			attr_dev(div139, "class", "col-md-4");
    			add_location(div139, file, 728, 4, 32508);
    			attr_dev(div140, "class", "row blog-wrapper");
    			add_location(div140, file, 684, 3, 30974);
    			attr_dev(div141, "class", "container");
    			add_location(div141, file, 677, 2, 30734);
    			attr_dev(section5, "id", "blog");
    			add_location(section5, file, 675, 1, 30711);
    			attr_dev(h27, "class", "section-title wow fadeInUp");
    			set_style(h27, "visibility", "visible");
    			set_style(h27, "animation-name", "fadeInUp");
    			add_location(h27, file, 761, 3, 33394);
    			attr_dev(div142, "class", "spacer");
    			attr_dev(div142, "data-height", "60");
    			set_style(div142, "height", "60px");
    			add_location(div142, file, 763, 3, 33510);
    			attr_dev(h39, "class", "wow fadeInUp");
    			set_style(h39, "visibility", "visible");
    			set_style(h39, "animation-name", "fadeInUp");
    			add_location(h39, file, 770, 6, 33691);
    			attr_dev(a23, "href", "mailto:name@example.com");
    			add_location(a23, file, 771, 114, 33919);
    			attr_dev(p17, "class", "wow fadeInUp");
    			set_style(p17, "visibility", "visible");
    			set_style(p17, "animation-name", "fadeInUp");
    			add_location(p17, file, 771, 6, 33811);
    			attr_dev(div143, "class", "contact-info");
    			add_location(div143, file, 769, 5, 33658);
    			attr_dev(div144, "class", "col-md-4");
    			add_location(div144, file, 767, 4, 33603);
    			if (!src_url_equal(img26.src, img26_src_value = "https://www.cloudways.com/blog/wp-content/uploads/Email-Hosting-Small-Business.jpg")) attr_dev(img26, "src", img26_src_value);
    			add_location(img26, file, 776, 5, 34027);
    			attr_dev(div145, "class", "col-md-8");
    			add_location(div145, file, 775, 4, 33999);
    			attr_dev(div146, "class", "row");
    			add_location(div146, file, 765, 3, 33580);
    			attr_dev(div147, "class", "container");
    			add_location(div147, file, 758, 2, 33340);
    			attr_dev(section6, "id", "contact");
    			add_location(section6, file, 756, 1, 33314);
    			attr_dev(div148, "class", "spacer");
    			attr_dev(div148, "data-height", "96");
    			set_style(div148, "height", "96px");
    			add_location(div148, file, 785, 1, 34171);
    			attr_dev(main, "class", "content svelte-18q8k5q");
    			add_location(main, file, 18, 0, 417);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, div0);
    			append_dev(div0, a0);
    			append_dev(header, t1);
    			append_dev(header, div1);
    			append_dev(div1, span0);
    			append_dev(div1, t2);
    			append_dev(div1, input);
    			append_dev(div1, t3);
    			append_dev(div1, button0);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, section0);
    			append_dev(section0, div15);
    			append_dev(div15, h20);
    			append_dev(div15, t7);
    			append_dev(div15, div2);
    			append_dev(div15, t8);
    			append_dev(div15, div13);
    			append_dev(div13, div6);
    			append_dev(div6, div4);
    			append_dev(div4, img0);
    			append_dev(div4, t9);
    			append_dev(div4, div3);
    			append_dev(div6, t11);
    			append_dev(div6, div5);
    			append_dev(div13, t12);
    			append_dev(div13, div12);
    			append_dev(div12, div11);
    			append_dev(div11, div10);
    			append_dev(div10, div9);
    			append_dev(div9, p0);
    			append_dev(div9, t14);
    			append_dev(div9, div7);
    			append_dev(div7, a1);
    			append_dev(div9, t16);
    			append_dev(div9, div8);
    			append_dev(div15, t17);
    			append_dev(div15, div14);
    			append_dev(div15, t18);
    			mount_component(modal, div15, null);
    			append_dev(main, t19);
    			append_dev(main, section1);
    			append_dev(section1, div27);
    			append_dev(div27, h21);
    			append_dev(div27, t21);
    			append_dev(div27, div16);
    			append_dev(div27, t22);
    			append_dev(div27, div25);
    			append_dev(div25, div19);
    			append_dev(div19, div17);
    			append_dev(div17, img1);
    			append_dev(div17, t23);
    			append_dev(div17, h30);
    			append_dev(div17, t25);
    			append_dev(div17, p1);
    			append_dev(div19, t27);
    			append_dev(div19, div18);
    			append_dev(div25, t28);
    			append_dev(div25, div22);
    			append_dev(div22, div20);
    			append_dev(div20, img2);
    			append_dev(div20, t29);
    			append_dev(div20, h31);
    			append_dev(div20, t31);
    			append_dev(div20, p2);
    			append_dev(div22, t33);
    			append_dev(div22, div21);
    			append_dev(div25, t34);
    			append_dev(div25, div24);
    			append_dev(div24, div23);
    			append_dev(div23, img3);
    			append_dev(div23, t35);
    			append_dev(div23, h32);
    			append_dev(div23, t37);
    			append_dev(div23, p3);
    			append_dev(div27, t39);
    			append_dev(div27, div26);
    			append_dev(div26, p4);
    			append_dev(p4, t40);
    			append_dev(p4, a2);
    			append_dev(p4, t42);
    			append_dev(main, t43);
    			append_dev(main, section2);
    			append_dev(section2, div47);
    			append_dev(div47, h22);
    			append_dev(div47, t45);
    			append_dev(div47, div28);
    			append_dev(div47, t46);
    			append_dev(div47, div46);
    			append_dev(div46, div36);
    			append_dev(div36, div35);
    			append_dev(div35, div30);
    			append_dev(div30, div29);
    			append_dev(div29, span1);
    			append_dev(div29, t48);
    			append_dev(div29, h33);
    			append_dev(div29, t50);
    			append_dev(div29, p5);
    			append_dev(div35, t52);
    			append_dev(div35, div32);
    			append_dev(div32, div31);
    			append_dev(div31, span2);
    			append_dev(div31, t54);
    			append_dev(div31, h34);
    			append_dev(div31, t56);
    			append_dev(div31, p6);
    			append_dev(div35, t58);
    			append_dev(div35, div34);
    			append_dev(div34, div33);
    			append_dev(div33, span3);
    			append_dev(div33, t60);
    			append_dev(div33, h35);
    			append_dev(div33, t62);
    			append_dev(div33, p7);
    			append_dev(div35, t64);
    			append_dev(div35, span4);
    			append_dev(div46, t65);
    			append_dev(div46, div45);
    			append_dev(div45, div37);
    			append_dev(div45, t66);
    			append_dev(div45, div44);
    			append_dev(div44, div39);
    			append_dev(div39, div38);
    			append_dev(div38, span5);
    			append_dev(div38, t68);
    			append_dev(div38, h36);
    			append_dev(div38, t70);
    			append_dev(div38, p8);
    			append_dev(div44, t72);
    			append_dev(div44, div41);
    			append_dev(div41, div40);
    			append_dev(div40, span6);
    			append_dev(div40, t74);
    			append_dev(div40, h37);
    			append_dev(div40, t76);
    			append_dev(div40, p9);
    			append_dev(div44, t78);
    			append_dev(div44, div43);
    			append_dev(div43, div42);
    			append_dev(div42, span7);
    			append_dev(div42, t80);
    			append_dev(div42, h38);
    			append_dev(div42, t82);
    			append_dev(div42, p10);
    			append_dev(div44, t84);
    			append_dev(div44, span8);
    			append_dev(main, t85);
    			append_dev(main, section3);
    			append_dev(section3, div84);
    			append_dev(div84, h23);
    			append_dev(div84, t87);
    			append_dev(div84, div48);
    			append_dev(div84, t88);
    			append_dev(div84, ul0);
    			append_dev(ul0, li0);
    			append_dev(ul0, t90);
    			append_dev(ul0, li1);
    			append_dev(ul0, t92);
    			append_dev(ul0, li2);
    			append_dev(ul0, t94);
    			append_dev(ul0, li3);
    			append_dev(ul0, t96);
    			append_dev(ul0, li4);
    			append_dev(div84, t98);
    			append_dev(div84, div49);
    			append_dev(div49, select);
    			append_dev(select, option0);
    			append_dev(select, option1);
    			append_dev(select, option2);
    			append_dev(select, option3);
    			append_dev(select, option4);
    			append_dev(div84, t104);
    			append_dev(div84, div82);
    			append_dev(div82, div54);
    			append_dev(div54, a3);
    			append_dev(a3, div53);
    			append_dev(div53, div50);
    			append_dev(div50, span9);
    			append_dev(div50, t106);
    			append_dev(div50, h40);
    			append_dev(div50, t108);
    			append_dev(div50, span10);
    			append_dev(span10, i0);
    			append_dev(div53, t109);
    			append_dev(div53, div52);
    			append_dev(div52, img4);
    			append_dev(div52, t110);
    			append_dev(div52, div51);
    			append_dev(div82, t111);
    			append_dev(div82, div60);
    			append_dev(div60, a4);
    			append_dev(a4, div58);
    			append_dev(div58, div55);
    			append_dev(div55, span11);
    			append_dev(div55, t113);
    			append_dev(div55, h41);
    			append_dev(div55, t115);
    			append_dev(div55, span12);
    			append_dev(span12, i1);
    			append_dev(div58, t116);
    			append_dev(div58, div57);
    			append_dev(div57, img5);
    			append_dev(div57, t117);
    			append_dev(div57, div56);
    			append_dev(div60, t118);
    			append_dev(div60, div59);
    			append_dev(div59, img6);
    			append_dev(div59, t119);
    			append_dev(div59, h24);
    			append_dev(div59, t121);
    			append_dev(div59, p11);
    			append_dev(div59, t123);
    			append_dev(div59, p12);
    			append_dev(div59, t125);
    			append_dev(div59, a5);
    			append_dev(div82, t127);
    			append_dev(div82, div65);
    			append_dev(div65, a6);
    			append_dev(a6, div64);
    			append_dev(div64, div61);
    			append_dev(div61, span13);
    			append_dev(div61, t129);
    			append_dev(div61, h42);
    			append_dev(div61, t131);
    			append_dev(div61, span14);
    			append_dev(span14, i2);
    			append_dev(div64, t132);
    			append_dev(div64, div63);
    			append_dev(div63, img7);
    			append_dev(div63, t133);
    			append_dev(div63, div62);
    			append_dev(div82, t134);
    			append_dev(div82, div70);
    			append_dev(div70, a7);
    			append_dev(a7, div69);
    			append_dev(div69, div66);
    			append_dev(div66, span15);
    			append_dev(div66, t136);
    			append_dev(div66, h43);
    			append_dev(div66, t138);
    			append_dev(div66, span16);
    			append_dev(span16, i3);
    			append_dev(div69, t139);
    			append_dev(div69, div68);
    			append_dev(div68, img8);
    			append_dev(div68, t140);
    			append_dev(div68, div67);
    			append_dev(div82, t141);
    			append_dev(div82, div76);
    			append_dev(div76, a8);
    			append_dev(a8, div74);
    			append_dev(div74, div71);
    			append_dev(div71, span17);
    			append_dev(div71, t143);
    			append_dev(div71, h44);
    			append_dev(div71, t145);
    			append_dev(div71, span18);
    			append_dev(span18, i4);
    			append_dev(div74, t146);
    			append_dev(div74, div73);
    			append_dev(div73, img9);
    			append_dev(div73, t147);
    			append_dev(div73, div72);
    			append_dev(div76, t148);
    			append_dev(div76, div75);
    			append_dev(div75, a9);
    			append_dev(div75, t149);
    			append_dev(div75, a10);
    			append_dev(div82, t150);
    			append_dev(div82, div81);
    			append_dev(div81, a11);
    			append_dev(a11, div80);
    			append_dev(div80, div77);
    			append_dev(div77, span19);
    			append_dev(div77, t152);
    			append_dev(div77, h45);
    			append_dev(div77, t154);
    			append_dev(div77, span20);
    			append_dev(span20, i5);
    			append_dev(div80, t155);
    			append_dev(div80, div79);
    			append_dev(div79, img10);
    			append_dev(div79, t156);
    			append_dev(div79, div78);
    			append_dev(div84, t157);
    			append_dev(div84, div83);
    			append_dev(div83, a12);
    			append_dev(a12, i6);
    			append_dev(a12, t158);
    			append_dev(div83, t159);
    			append_dev(div83, ul1);
    			append_dev(ul1, li5);
    			append_dev(ul1, t161);
    			append_dev(ul1, li6);
    			append_dev(li6, a13);
    			append_dev(main, t163);
    			append_dev(main, section4);
    			append_dev(section4, div126);
    			append_dev(div126, h25);
    			append_dev(div126, t165);
    			append_dev(div126, div85);
    			append_dev(div126, t166);
    			append_dev(div126, div100);
    			append_dev(div100, div99);
    			append_dev(div99, div98);
    			append_dev(div98, div88);
    			append_dev(div88, div86);
    			append_dev(div86, img11);
    			append_dev(div88, t167);
    			append_dev(div88, h46);
    			append_dev(div88, t169);
    			append_dev(div88, span21);
    			append_dev(div88, t171);
    			append_dev(div88, div87);
    			append_dev(div87, p13);
    			append_dev(div88, t173);
    			append_dev(div98, div91);
    			append_dev(div91, div89);
    			append_dev(div89, img12);
    			append_dev(div91, t174);
    			append_dev(div91, h47);
    			append_dev(div91, t176);
    			append_dev(div91, span22);
    			append_dev(div91, t178);
    			append_dev(div91, div90);
    			append_dev(div90, p14);
    			append_dev(div91, t180);
    			append_dev(div98, div94);
    			append_dev(div94, div92);
    			append_dev(div92, img13);
    			append_dev(div94, t181);
    			append_dev(div94, h48);
    			append_dev(div94, t183);
    			append_dev(div94, span23);
    			append_dev(div94, t185);
    			append_dev(div94, div93);
    			append_dev(div93, p15);
    			append_dev(div94, t187);
    			append_dev(div98, div97);
    			append_dev(div97, div95);
    			append_dev(div95, img14);
    			append_dev(div97, t188);
    			append_dev(div97, h49);
    			append_dev(div97, t190);
    			append_dev(div97, span24);
    			append_dev(div97, t192);
    			append_dev(div97, div96);
    			append_dev(div96, p16);
    			append_dev(div100, t194);
    			append_dev(div100, ul2);
    			append_dev(ul2, li7);
    			append_dev(li7, button1);
    			append_dev(ul2, li8);
    			append_dev(li8, button2);
    			append_dev(div126, t197);
    			append_dev(div126, div125);
    			append_dev(div125, div103);
    			append_dev(div103, div102);
    			append_dev(div102, div101);
    			append_dev(div101, img15);
    			append_dev(div125, t198);
    			append_dev(div125, div106);
    			append_dev(div106, div105);
    			append_dev(div105, div104);
    			append_dev(div104, img16);
    			append_dev(div125, t199);
    			append_dev(div125, div109);
    			append_dev(div109, div108);
    			append_dev(div108, div107);
    			append_dev(div107, img17);
    			append_dev(div125, t200);
    			append_dev(div125, div112);
    			append_dev(div112, div111);
    			append_dev(div111, div110);
    			append_dev(div110, img18);
    			append_dev(div125, t201);
    			append_dev(div125, div115);
    			append_dev(div115, div114);
    			append_dev(div114, div113);
    			append_dev(div113, img19);
    			append_dev(div125, t202);
    			append_dev(div125, div118);
    			append_dev(div118, div117);
    			append_dev(div117, div116);
    			append_dev(div116, img20);
    			append_dev(div125, t203);
    			append_dev(div125, div121);
    			append_dev(div121, div120);
    			append_dev(div120, div119);
    			append_dev(div119, img21);
    			append_dev(div125, t204);
    			append_dev(div125, div124);
    			append_dev(div124, div123);
    			append_dev(div123, div122);
    			append_dev(div122, img22);
    			append_dev(main, t205);
    			append_dev(main, section5);
    			append_dev(section5, div141);
    			append_dev(div141, h26);
    			append_dev(div141, t207);
    			append_dev(div141, div127);
    			append_dev(div141, t208);
    			append_dev(div141, div140);
    			append_dev(div140, div131);
    			append_dev(div131, div130);
    			append_dev(div130, div128);
    			append_dev(div128, a14);
    			append_dev(a14, span25);
    			append_dev(div128, t210);
    			append_dev(div128, a15);
    			append_dev(a15, img23);
    			append_dev(div130, t211);
    			append_dev(div130, div129);
    			append_dev(div129, h410);
    			append_dev(h410, a16);
    			append_dev(div129, t213);
    			append_dev(div129, ul3);
    			append_dev(ul3, li9);
    			append_dev(ul3, t215);
    			append_dev(ul3, li10);
    			append_dev(div140, t217);
    			append_dev(div140, div135);
    			append_dev(div135, div134);
    			append_dev(div134, div132);
    			append_dev(div132, a17);
    			append_dev(a17, span26);
    			append_dev(div132, t219);
    			append_dev(div132, a18);
    			append_dev(a18, img24);
    			append_dev(div134, t220);
    			append_dev(div134, div133);
    			append_dev(div133, h411);
    			append_dev(h411, a19);
    			append_dev(div133, t222);
    			append_dev(div133, ul4);
    			append_dev(ul4, li11);
    			append_dev(ul4, t224);
    			append_dev(ul4, li12);
    			append_dev(div140, t226);
    			append_dev(div140, div139);
    			append_dev(div139, div138);
    			append_dev(div138, div136);
    			append_dev(div136, a20);
    			append_dev(a20, span27);
    			append_dev(div136, t228);
    			append_dev(div136, a21);
    			append_dev(a21, img25);
    			append_dev(div138, t229);
    			append_dev(div138, div137);
    			append_dev(div137, h412);
    			append_dev(h412, a22);
    			append_dev(div137, t231);
    			append_dev(div137, ul5);
    			append_dev(ul5, li13);
    			append_dev(ul5, t233);
    			append_dev(ul5, li14);
    			append_dev(main, t235);
    			append_dev(main, section6);
    			append_dev(section6, div147);
    			append_dev(div147, h27);
    			append_dev(div147, t237);
    			append_dev(div147, div142);
    			append_dev(div147, t238);
    			append_dev(div147, div146);
    			append_dev(div146, div144);
    			append_dev(div144, div143);
    			append_dev(div143, h39);
    			append_dev(div143, t240);
    			append_dev(div143, p17);
    			append_dev(p17, t241);
    			append_dev(p17, a23);
    			append_dev(p17, t243);
    			append_dev(div146, t244);
    			append_dev(div146, div145);
    			append_dev(div145, img26);
    			append_dev(main, t245);
    			append_dev(main, div148);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const modal_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(main);
    			destroy_component(modal);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let { name } = $$props;
    	const writable_props = ['name'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	$$self.$capture_state = () => ({ name, Content, FactItem, Modal });

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { name: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !('name' in props)) {
    			console.warn("<App> was created without expected prop 'name'");
    		}
    	}

    	get name() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
