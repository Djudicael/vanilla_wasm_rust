const memory = new WebAssembly.Memory({ initial: 256, maximum: 256 });


async function run() {
    console.log('Running...');
    const response = await fetch('target/wasm32-unknown-unknown/debug/vanilla_wasm.wasm');
    // const module = await WebAssembly.instantiateStreaming(response);
    // const { name, add, memory } = module.instance.exports;
    const bytes = await response.arrayBuffer();
    const module = await WebAssembly.instantiate(bytes, {});
    const { name, add, memory, MyClass, MyClass_new, get_json } = module.instance.exports;

    console.log(add(7, 2)); // should print 3
    const messagePointer = name();
    console.log(messagePointer);
    // const message = new Uint8Array(module.instance.exports.memory.buffer, messagePointer);
    const message = new Uint8Array(memory.buffer, messagePointer);
    // const messageString = new TextDecoder('utf-8').decode(message);
    const messageString = new TextDecoder().decode(message);
    console.log(messageString);

    const myClassPtr = MyClass_new();
    const myClass = {
        ptr: myClassPtr,
        getNumber: () => module.instance.exports.MyClass_get_number(myClassPtr),
        setNumber: (n) => module.instance.exports.MyClass_set_number(myClassPtr, n),
        render: () => {
            const messagePointer = module.instance.exports.MyClass_render(myClassPtr);
            const messageArray = new Uint8Array(module.instance.exports.memory.buffer, messagePointer);
            const message = new TextDecoder().decode(messageArray);
            return message;
        }
    };

    console.log(myClass.getNumber()); // Output: 42
    myClass.setNumber(100);
    console.log(myClass.getNumber()); // Output: 100
    console.log(myClass.render());


    const jsonPointer = get_json();
    const jsonString = new TextDecoder("utf-8").decode(new Uint8Array(memory.buffer, jsonPointer))
    console.log(jsonString);

}


run(); 