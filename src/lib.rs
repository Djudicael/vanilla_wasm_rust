extern crate core;

use serde::Serialize;

#[derive(Serialize)]
struct MyData {
    name: String,
    age: u32,
}

#[no_mangle]
pub extern "C" fn get_json() -> *const u8 {
    let data = MyData {
        name: "tatayoyoy".to_string(),
        age: 32,
    };

    let json_string = serde_json::to_string(&data).unwrap();
    let json_bytes = json_string.as_bytes();
    let json_bytes_ptr = json_bytes.as_ptr();
    core::mem::forget(json_string);

    json_bytes_ptr
}

#[no_mangle]
pub extern "C" fn add(a: i32, b: i32) -> i32 {
    a + b
}

#[no_mangle]
pub extern "C" fn add2(a: i32, b: i32) -> i32 {
    a + b
}

#[no_mangle]
pub extern "C" fn name() -> *const u8 {
    b"tatayoyoy\0".as_ptr()
}

// #[no_mangle]
// pub extern "C" fn log(message: *const i8) {
//     let message = unsafe { std::ffi::CStr::from_ptr(message).to_string_lossy() };
//     println!("{}", message);
// }

#[repr(C)]
pub struct MyClass {
    number: u32,
}

#[no_mangle]
pub extern "C" fn MyClass_new() -> *mut MyClass {
    Box::into_raw(Box::new(MyClass { number: 42 }))
}

#[no_mangle]
pub extern "C" fn MyClass_get_number(this: *const MyClass) -> u32 {
    let my_class = unsafe { &*this };
    my_class.number
}

#[no_mangle]
pub extern "C" fn MyClass_set_number(this: *mut MyClass, n: u32) {
    let my_class = unsafe { &mut *this };
    my_class.number = n;
}

#[no_mangle]
pub extern "C" fn MyClass_render(this: *const MyClass) -> *const u8 {
    let my_class = unsafe { &*this };
    let message = format!("My number is: {}", my_class.number);
    message.as_ptr()
}
