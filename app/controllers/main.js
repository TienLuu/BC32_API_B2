// Lấy list user thông qua api
getUser();

function getUser() {
   apiGetUser()
      .then((respone) => {
         let users = respone.data.map((user) => {
            return new User(
               user.id,
               user.taiKhoan,
               user.hoTen,
               user.matKhau,
               user.email,
               user.loaiND,
               user.ngonNgu
            );
         });

         dislay(users);
      })
      .catch((error) => {
         console.log(error);
      });
}

// DOM
function dom(id) {
   return document.querySelector(id);
}

// Hiển thị ra layout
function dislay(users) {
   let html = users.reduce((result, user) => {
      return (
         result +
         `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.taiKhoan}</td>
                    <td>${user.matKhau}</td>
                    <td>${user.hoTen}</td>
                    <td>${user.email}</td>
                    <td>${user.ngonNgu}</td>
                    <td>${user.loaiND}</td>
                    <td>
                        <button class="btn btn-success" data-id=${user.id} data-type="edit" data-target="#myModal" data-toggle="modal">Sửa</button>
                        <button class="btn btn-danger" data-id=${user.id} data-type="delete">Xoá</button>
                    </td>
                </tr>
            `
      );
   }, "");

   dom("#tblDanhSachNguoiDung").innerHTML = html;
}

// Reset Form
function resetForm() {
   dom("#TaiKhoan").value = "";
   dom("#TaiKhoan").disabled = false;

   dom("#HoTen").value = "";
   dom("#MatKhau").value = "";
   dom("#Email").value = "";
   dom("#HinhAnh").value = "";
   dom("#loaiNguoiDung").value = "";
   dom("#loaiNgonNgu").value = "";
   dom("#MoTa").value = "";
}

// Thay đổi nội dung modal khi click vào btn Thêm mới
dom("#btnThemNguoiDung").addEventListener("click", function () {
   dom(".modal-title").innerHTML = "Thêm người dùng";
   dom(".modal-footer").innerHTML = `
        <button class="btn btn-success" data-type="add">Thêm</button>
        <button class="btn btn-danger" data-dismiss="modal">Đóng</button>
   `;

   resetForm();
});

// Lắng nghe sự kiện khi click vào footer của modal
dom(".modal-footer").addEventListener("click", function (e) {
   // Lấy attribute của btn khi click vào modal-footer
   let elType = e.target.getAttribute("data-type");
   let id = e.target.getAttribute("data-id");

   // DOM
   let taiKhoan = dom("#TaiKhoan").value;
   let hoTen = dom("#HoTen").value;
   let matKhau = dom("#MatKhau").value;
   let email = dom("#Email").value;
   let hinAnh = dom("#HinhAnh").value;
   let loaiND = dom("#loaiNguoiDung").value;
   let ngonNgu = dom("#loaiNgonNgu").value;
   let moTa = dom("#MoTa").value;

   if (!checkValidateForm()) {
      return;
   }

   let user = new User(
      null,
      taiKhoan,
      hoTen,
      matKhau,
      email,
      loaiND,
      ngonNgu,
      moTa,
      hinAnh
   );

   if (elType === "add") {
      addUser(user);
   }

   if (elType === "update") {
      updateUser(user, id);
   }
});

// Lắng nghe sự kiện khi click vào vùng table
dom("#tblNguoiDung").addEventListener("click", function (e) {
   const elType = e.target.getAttribute("data-type");
   const id = e.target.getAttribute("data-id");

   if (elType === "delete") {
      deleteUser(id);
   }

   if (elType === "edit") {
      // Chỉnh sửa lại layout modal
      dom(".modal-title").innerHTML = "Cập nhật người dùng";
      dom(".modal-footer").innerHTML = `
        <button class="btn btn-success" data-type="update" data-id=${id}>Cập nhật</button>
        <button class="btn btn-danger" data-dismiss="modal">Đóng</button>
        `;

      apitGetProductById(id)
         .then((respone) => {
            const user = respone.data;

            dom("#TaiKhoan").value = user.taiKhoan;
            dom("#TaiKhoan").disabled = true;

            dom("#HoTen").value = user.hoTen;
            dom("#MatKhau").value = user.matKhau;
            dom("#Email").value = user.email;
            dom("#HinhAnh").value = user.hinhAnh;
            dom("#loaiNguoiDung").value = user.loaiND;
            dom("#loaiNgonNgu").value = user.ngonNgu;
            dom("#MoTa").value = user.moTa;
         })
         .catch((error) => {
            console.log(error);
         });
   }
});

function addUser(user) {
   apiAddUser(user)
      .then(() => {
         getUser();
      })
      .catch((error) => {
         console.log(error);
      });
}

function deleteUser(id) {
   apiDeleteUser(id)
      .then(() => {
         getUser();
      })
      .catch((error) => {
         console.log(error);
      });
}

function updateUser(user, id) {
   apiUpdateUser(user, id)
      .then((respone) => {
         console.log(respone.data);
         getUser();
      })
      .catch((error) => {
         console.log(error);
      });
}

// Validation
function validateTaiKhoan() {
   const taiKhoan = dom("#TaiKhoan").value;
   const spanEl = dom("#spanTaiKhoan");

   if (!taiKhoan) {
      spanEl.innerHTML = "Tài khoản không được để trống!";
      return false;
   }

   apiGetUser()
      .then((respone) => {
         let checkDuplicateTK = respone.data.filter((user) => {
            return user.taiKhoan === taiKhoan;
         });

         if (checkDuplicateTK.length > 0) {
            spanEl.innerHTML = "Tài khoản đã tồn tại!";
            return false;
         }
      })
      .catch((error) => {
         console.log(error);
      });

   spanEl.innerHTML = "";
   return true;
}

function validateHoTen() {
   const hoTen = dom("#HoTen").value;
   const spanEl = dom("#spanHoTen");
   const regex = /^[A-Za-z]+$/;

   if (!hoTen) {
      spanEl.innerHTML = "Họ tên không được để trống!";
      return false;
   }

   if (!regex.test(hoTen)) {
      spanEl.innerHTML = "Họ tên không bao gồm số và ký tự đặc biệt!";
      return false;
   }

   spanEl.innerHTML = "";
   return true;
}

function validateMatKhau() {
   const matKhau = dom("#MatKhau").value;
   const spanEl = dom("#spanMatKhau");
   const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,8}$/;

   if (!matKhau) {
      spanEl.innerHTML = "Mật khẩu không được để trống!";
      return false;
   }

   if (!regex.test(matKhau)) {
      spanEl.innerHTML =
         "Mật khẩu phải có 1 ký tự hoa, 1 đặc biệt, 1 ký tự số, độ dài 6-8!";
      return false;
   }

   spanEl.innerHTML = "";
   return true;
}

function validateEmail() {
   const email = dom("#Email").value;
   const spanEl = dom("#spanEmail");
   const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

   if (!email) {
      spanEl.innerHTML = "Email không được để trống!";
      return false;
   }

   if (!regex.test(email)) {
      spanEl.innerHTML = "Email không đúng định dạng!";
      return false;
   }

   spanEl.innerHTML = "";
   return true;
}

function validateHinhAnh() {
   const hinhAnh = dom("#HinhAnh").value;
   const spanEl = dom("#spanHinhAnh");

   if (!hinhAnh) {
      spanEl.innerHTML = "Hình ảnh không được để trống!";
      return false;
   }

   spanEl.innerHTML = "";
   return true;
}

function validateLoaiND() {
   const loaiND = dom("#loaiNguoiDung").value;
   const spanEl = dom("#spanLoaiND");

   if (!loaiND) {
      spanEl.innerHTML = "Loại người dùng không được để trống!";
      return false;
   }

   spanEl.innerHTML = "";
   return true;
}

function validateNgonNgu() {
   const ngonNgu = dom("#loaiNgonNgu").value;
   const spanEl = dom("#spanNgonNgu");

   if (!ngonNgu) {
      spanEl.innerHTML = "Ngôn ngữ không được để trống!";
      return false;
   }

   spanEl.innerHTML = "";
   return true;
}

function validateMoTa() {
   const moTa = dom("#MoTa").value;
   const spanEl = dom("#spanMoTa");

   if (!moTa) {
      spanEl.innerHTML = "Mô tả không được để trống!";
      return false;
   }

   spanEl.innerHTML = "";
   return true;
}

function checkValidateForm() {
   let isValid = true;

   isValid =
      validateTaiKhoan() &
      validateHoTen() &
      validateMatKhau() &
      validateEmail() &
      validateHinhAnh() &
      validateLoaiND() &
      validateNgonNgu() &
      validateMoTa();

   if (!isValid) {
      return false;
   }

   return true;
}
