# Generated by Django 3.0.7 on 2020-06-10 23:22

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Setting',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('period', models.TextField(null=True)),
                ('commissionPercentage', models.TextField(null=True)),
                ('minimumCommission', models.TextField(null=True)),
                ('buysellMargin', models.TextField(null=True)),
                ('surcharge', models.TextField(null=True)),
            ],
        ),
    ]
