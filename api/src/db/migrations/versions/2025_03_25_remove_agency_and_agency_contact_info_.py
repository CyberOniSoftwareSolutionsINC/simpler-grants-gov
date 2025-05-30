"""Remove agency and agency contact info tables

Revision ID: ca3a21e9c44f
Revises: 661a773a8478
Create Date: 2025-03-24 23:17:53.235144

"""

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "ca3a21e9c44f"
down_revision = "661a773a8478"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("link_agency_download_file_type", schema="api")
    op.drop_index(op.f("agency_agency_code_idx"), table_name="agency", schema="api")
    op.drop_table("agency", schema="api")
    op.drop_table("agency_contact_info", schema="api")
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "link_agency_download_file_type",
        sa.Column("agency_id", sa.BIGINT(), autoincrement=False, nullable=False),
        sa.Column(
            "agency_download_file_type_id", sa.INTEGER(), autoincrement=False, nullable=False
        ),
        sa.Column(
            "created_at",
            postgresql.TIMESTAMP(timezone=True),
            server_default=sa.text("now()"),
            autoincrement=False,
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            postgresql.TIMESTAMP(timezone=True),
            server_default=sa.text("now()"),
            autoincrement=False,
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["agency_download_file_type_id"],
            ["api.lk_agency_download_file_type.agency_download_file_type_id"],
            name="link_agency_download_file_type_agency_download_file_typ_5f33",
        ),
        sa.ForeignKeyConstraint(
            ["agency_id"],
            ["api.agency.agency_id"],
            name="link_agency_download_file_type_agency_id_agency_fkey",
        ),
        sa.PrimaryKeyConstraint(
            "agency_id", "agency_download_file_type_id", name="link_agency_download_file_type_pkey"
        ),
        schema="api",
    )
    op.create_table(
        "agency",
        sa.Column("agency_id", sa.BIGINT(), autoincrement=True, nullable=False),
        sa.Column("agency_name", sa.TEXT(), autoincrement=False, nullable=False),
        sa.Column("agency_code", sa.TEXT(), autoincrement=False, nullable=False),
        sa.Column("sub_agency_code", sa.TEXT(), autoincrement=False, nullable=True),
        sa.Column("assistance_listing_number", sa.TEXT(), autoincrement=False, nullable=False),
        sa.Column(
            "agency_submission_notification_setting_id",
            sa.INTEGER(),
            autoincrement=False,
            nullable=False,
        ),
        sa.Column("agency_contact_info_id", sa.BIGINT(), autoincrement=False, nullable=True),
        sa.Column("is_test_agency", sa.BOOLEAN(), autoincrement=False, nullable=False),
        sa.Column("ldap_group", sa.TEXT(), autoincrement=False, nullable=True),
        sa.Column("description", sa.TEXT(), autoincrement=False, nullable=True),
        sa.Column("label", sa.TEXT(), autoincrement=False, nullable=True),
        sa.Column("is_multilevel_agency", sa.BOOLEAN(), autoincrement=False, nullable=False),
        sa.Column("is_multiproject", sa.BOOLEAN(), autoincrement=False, nullable=False),
        sa.Column(
            "has_system_to_system_certificate", sa.BOOLEAN(), autoincrement=False, nullable=False
        ),
        sa.Column(
            "can_view_packages_in_grace_period", sa.BOOLEAN(), autoincrement=False, nullable=False
        ),
        sa.Column("is_image_workspace_enabled", sa.BOOLEAN(), autoincrement=False, nullable=False),
        sa.Column(
            "is_validation_workspace_enabled", sa.BOOLEAN(), autoincrement=False, nullable=False
        ),
        sa.Column(
            "created_at",
            postgresql.TIMESTAMP(timezone=True),
            server_default=sa.text("now()"),
            autoincrement=False,
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            postgresql.TIMESTAMP(timezone=True),
            server_default=sa.text("now()"),
            autoincrement=False,
            nullable=False,
        ),
        sa.Column("top_level_agency_id", sa.BIGINT(), autoincrement=False, nullable=True),
        sa.ForeignKeyConstraint(
            ["agency_contact_info_id"],
            ["api.agency_contact_info.agency_contact_info_id"],
            name="agency_agency_contact_info_id_agency_contact_info_fkey",
        ),
        sa.ForeignKeyConstraint(
            ["agency_submission_notification_setting_id"],
            [
                "api.lk_agency_submission_notification_setting.agency_submission_notification_setting_id"
            ],
            name="agency_agency_submission_notification_setting_id_lk_age_592f",
        ),
        sa.ForeignKeyConstraint(
            ["top_level_agency_id"],
            ["api.agency.agency_id"],
            name="agency_top_level_agency_id_agency_fkey",
        ),
        sa.PrimaryKeyConstraint("agency_id", name="agency_pkey"),
        schema="api",
    )
    op.create_index("agency_agency_code_idx", "agency", ["agency_code"], unique=True, schema="api")
    op.create_table(
        "agency_contact_info",
        sa.Column("agency_contact_info_id", sa.BIGINT(), autoincrement=True, nullable=False),
        sa.Column("contact_name", sa.TEXT(), autoincrement=False, nullable=False),
        sa.Column("address_line_1", sa.TEXT(), autoincrement=False, nullable=False),
        sa.Column("address_line_2", sa.TEXT(), autoincrement=False, nullable=True),
        sa.Column("city", sa.TEXT(), autoincrement=False, nullable=False),
        sa.Column("state", sa.TEXT(), autoincrement=False, nullable=False),
        sa.Column("zip_code", sa.TEXT(), autoincrement=False, nullable=False),
        sa.Column("phone_number", sa.TEXT(), autoincrement=False, nullable=False),
        sa.Column("primary_email", sa.TEXT(), autoincrement=False, nullable=False),
        sa.Column("secondary_email", sa.TEXT(), autoincrement=False, nullable=True),
        sa.Column(
            "created_at",
            postgresql.TIMESTAMP(timezone=True),
            server_default=sa.text("now()"),
            autoincrement=False,
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            postgresql.TIMESTAMP(timezone=True),
            server_default=sa.text("now()"),
            autoincrement=False,
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("agency_contact_info_id", name="agency_contact_info_pkey"),
        schema="api",
    )
    # ### end Alembic commands ###
