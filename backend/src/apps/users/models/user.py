from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.core.mail import send_mail
from django.db import models
from django.utils.translation import gettext_lazy as _
from src.apps.users.managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):
    id = models.AutoField(primary_key=True)

    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    created_at = models.DateField(auto_now_add=True)

    is_confirmed = models.BooleanField(default=True)
    is_2fa = models.BooleanField(default=False)

    is_active = models.BooleanField(default=True)
    deactivated_at = models.DateField(null=True, blank=True)

    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = UserManager()

    first_name = models.CharField(
        max_length=30,
        verbose_name=_("First Name"),
        help_text=_("First name of the user"),
        null=True,
        blank=True,
    )
    last_name = models.CharField(
        max_length=30,
        verbose_name=_("Last Name"),
        help_text=_("Last name of the user"),
        null=True,
        blank=True,
    )

    edrpou = models.IntegerField(
        unique=True,
        verbose_name=_("ЄДРПОУ"),
        help_text=_("Код ЄДРПОУ особи"),
    )

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]

    class Meta:
        db_table = "auth_user"
        verbose_name = _("user")
        verbose_name_plural = _("users")

    def __str__(self) -> str:
        return f"username: {self.username}, email: {self.email}"

    def email_user(self, subject, message, from_email=None, **kwargs):
        """Send an email to this user."""
        send_mail(subject, message, from_email, [self.email], **kwargs)
